{-# language OverloadedStrings #-}
{-# language DataKinds #-}

module Peas.Application where

import Peas.Prelude

import Peas.Endpoints
import Peas.PageServer
import Peas.DatabaseOperations

import Servant
import Network.Wai.Handler.Warp

import Servant.Server.Internal.Context as C

import Servant.Auth.Server as SAS

import Database.PostgreSQL.Simple

import Control.Monad.Reader

instance SAS.FromJWT ()
instance SAS.ToJWT ()

runApplication :: IO ()
runApplication = do
  myKey <- generateKey
  let settings = defaultJWTSettings myKey
  dbConn <- connectPostgreSQL "postgresql://localhost:5432/project?host=/tmp"
  run 8081 (application
             ( (defaultCookieSettings
                 { cookieIsSecure = NotSecure
                 , cookieSameSite = SameSiteStrict
                 , cookieXsrfSetting = Nothing })
               C.:. settings
               C.:. EmptyContext)
             dbConn)

type ApplicationEndpoints = PageEndpoint :<|> DataEndpoints

applicationEndpoints :: Proxy ApplicationEndpoints
applicationEndpoints = Proxy

application :: C.Context '[SAS.CookieSettings, SAS.JWTSettings] ->
               Connection -> Application
application ctx dbConn =
  serveWithContext
  applicationEndpoints
  ctx
  (server (C.getContextEntry ctx) (C.getContextEntry ctx) dbConn)

server :: CookieSettings -> JWTSettings -> Connection ->
  Server ApplicationEndpoints
server cs jwts dbConn
  = pageEndpointHandler
    :<|> getSkillsHandler dbConn
    :<|> authenticateHandler cs jwts dbConn
    
    :<|> handleAGet dbConn
    :<|> handleANew dbConn
    :<|> handleAUp dbConn
    :<|> handleADel dbConn

handleAGet :: Connection -> AuthResult () -> Handler [Employee]
handleAGet dbConn ( SAS.Authenticated _ ) = getEmployeeHandler dbConn
handleAGet _ _ = throwError err401

handleANew :: Connection -> AuthResult () -> NewEmployee -> Handler ()
handleANew dbConn ( SAS.Authenticated _ ) = newEmployeeHandler dbConn
handleANew _ _ = \_ -> throwError err401

handleAUp :: Connection -> AuthResult () -> Text -> UpdateEmployee -> Handler ()
handleAUp dbConn ( SAS.Authenticated _ ) = updateEmployeeHandler dbConn
handleAUp _ _ = \_ _ ->throwError err401

handleADel :: Connection -> AuthResult () -> Text -> Handler ()
handleADel dbConn ( SAS.Authenticated _ ) = deleteEmployeeHandler dbConn
handleADel _ _ = \_ -> throwError err401

authenticateHandler :: SAS.CookieSettings ->
                       SAS.JWTSettings ->
                       Connection ->
                       UserLogin -> Handler (Headers '[ Header "Set-Cookie" SetCookie
                                                      , Header "Set-Cookie" SetCookie] ())
authenticateHandler cs jwts dbConn userlogin = do
  result <- liftIO $ runReaderT (authenticateUser userlogin) dbConn
  if not result then throwError err401 else do 
    mApplyCookies <- liftIO $ acceptLogin cs jwts ()
    maybe (throwError err401) (\applyCookies -> pure $ applyCookies ()) mApplyCookies

getEmployeeHandler :: Connection -> Handler [Employee]
getEmployeeHandler dbConn = liftIO $ runReaderT getEmployees dbConn

newEmployeeHandler :: Connection -> NewEmployee -> Handler ()
newEmployeeHandler dbConn newEmployee =
  liftIO $ runReaderT (postEmployee newEmployee) dbConn >> pure ()

updateEmployeeHandler :: Connection -> Text -> UpdateEmployee -> Handler ()
updateEmployeeHandler dbConn empId employee =
  liftIO $ runReaderT (putEmployee empId employee) dbConn >> pure ()

deleteEmployeeHandler :: Connection -> Text -> Handler ()
deleteEmployeeHandler dbConn empId = 
  liftIO $ runReaderT (deleteEmployee empId) dbConn >> pure ()

getSkillsHandler :: Connection -> Handler [ Skill ]
getSkillsHandler dbConn = liftIO $ runReaderT getSkills dbConn

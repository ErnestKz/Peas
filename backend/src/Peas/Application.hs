{-# language OverloadedStrings #-}

module Peas.Application where

import Peas.Prelude

import Peas.Endpoints
import Peas.PageServer
import Peas.DatabaseOperations

import Servant
import Network.Wai
import Network.Wai.Handler.Warp
import Network.Wai.Middleware.RequestLogger
import Network.Wai.Middleware.RequestLogger.JSON

import Database.PostgreSQL.Simple

import Control.Monad.Reader

runApplication :: IO ()
runApplication = do
  dbConn <- connectPostgreSQL "postgresql://localhost:5432/project?host=/tmp"
  run 8081 (application dbConn)

type ApplicationEndpoints = PageEndpoint :<|> PublicEmployeeEndpoints

applicationEndpoints :: Proxy ApplicationEndpoints
applicationEndpoints = Proxy

application :: Connection -> Application
application dbConn = serve applicationEndpoints (server dbConn)

server :: Connection -> Server ApplicationEndpoints
server dbConn
  = pageEndpointHandler
  :<|> getEmployeeHandler dbConn
  :<|> newEmployeeHandler dbConn
  :<|> updateEmployeeHandler dbConn
  :<|> deleteEmployeeHandler dbConn

getEmployeeHandler :: Connection -> Handler [Employee]
getEmployeeHandler dbConn = liftIO $ runReaderT getEmployees dbConn

newEmployeeHandler :: Connection -> NewEmployee -> Handler NoContent
newEmployeeHandler dbConn newEmployee =
  liftIO $ runReaderT (postEmployee newEmployee) dbConn >> pure NoContent

updateEmployeeHandler :: Connection -> Text -> UpdateEmployee -> Handler NoContent
updateEmployeeHandler dbConn = undefined

deleteEmployeeHandler :: Connection -> Text -> Handler NoContent
deleteEmployeeHandler dbConn = undefined

{-
module that defines the interface to the database
- reader monad
- execute reader monad
- read in a config for the db
  - develop, test, prod

- then the handler needs to somehow integrate with the monad
-}

{-# language DataKinds #-}
{-# LANGUAGE StandaloneKindSignatures #-}

module Peas.Endpoints where

import Peas.Prelude
import Peas.DatabaseOperations

import Servant.API
import Servant.Auth.Server as SAS

type DataEndpoints
  = ("skills" :> Get '[JSON] [Skill])
  
    :<|> ("authenticate" :>
          ReqBody '[JSON] UserLogin :>
          Post '[JSON] (Headers '[ Header "Set-Cookie" SetCookie
                                 , Header "Set-Cookie" SetCookie ] ()))
    
    :<|> PrivateEndpoints'


-- type EmployeeEndpoints = (Get '[JSON] [Employee]
--                              :<|> (ReqBody '[JSON] NewEmployee :>
--                                   Post '[JSON] ())
--                              :<|> (Capture "employeeid" Text :>
--                                    ReqBody '[JSON] UpdateEmployee :> Put '[JSON] ())
--                              :<|> (Capture "employeeid" Text :> Delete '[JSON] ()))
                
-- type PrivateEndpoints = ( SAS.Auth '[Cookie] () :> ("employee" :> EmployeeEndpoints))

type PrivateEndpoints' = ("employee" :>
                           ( (SAS.Auth '[Cookie] () :> Get '[JSON] [Employee])
                             :<|> (SAS.Auth '[Cookie] () :> ReqBody '[JSON] NewEmployee :> Post '[JSON] ())
                             :<|> (SAS.Auth '[Cookie] () :> Capture "employeeid" Text :> ReqBody '[JSON] UpdateEmployee :> Put '[JSON] ())
                             :<|> (SAS.Auth '[Cookie] () :> Capture "employeeid" Text :> Delete '[JSON] () ) ))

{-# language DataKinds #-}
{-# LANGUAGE StandaloneKindSignatures #-}

module Peas.Endpoints where

import Peas.Prelude
import Peas.DatabaseOperations

import Servant.API
import Servant.Auth.Server as SAS

type PrivateEmployeeEndpoints
  = ("skills" :> Get '[JSON] [Skill])
  
    :<|> ("authenticate" :>
          ReqBody '[JSON] UserLogin :>
          Post '[JSON] (Headers '[ Header "Set-Cookie" SetCookie
                                 , Header "Set-Cookie" SetCookie ] ()))
    
    :<|> ( SAS.Auth '[Cookie] () :>
           ("employee" :>
            (Get '[JSON] [Employee]
             :<|> (ReqBody '[JSON] NewEmployee :>
                    Post '[JSON] ())
              :<|> (Capture "employeeid" Text :>
                     ReqBody '[JSON] UpdateEmployee :> Put '[JSON] ())
             :<|> (Capture "employeeid" Text :> Delete '[JSON] ()))))
  
                       

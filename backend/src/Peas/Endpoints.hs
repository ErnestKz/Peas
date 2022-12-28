{-# language DataKinds #-}
{-# LANGUAGE StandaloneKindSignatures #-}

module Peas.Endpoints where

import Peas.Prelude
import Peas.DatabaseOperations

import Servant.API
import Servant.Auth.Server

type PrivateEmployeeEndpoints
  = "employee" :> Auth '[JWT] () :> EmployeeEndpoints

type PublicEmployeeEndpoints
  = "skills" :> Get '[JSON] [Skill]
  :<|>  "employee" :>  EmployeeEndpoints

type EmployeeEndpoints = 
  (Get '[JSON] [Employee]
   :<|> (ReqBody '[JSON] (NewEmployee)
          :> PostNoContent)
    
   :<|> (Capture "employeeid" Text
         :> ReqBody '[JSON] (UpdateEmployee)
         :> PutNoContent)
    
   :<|> (Capture "employeeid" Text
          :> DeleteNoContent)
  )
{-
type AuthenticateEndpoint
  = "authenticate"
  :> ReqBody '[JSON] LoginForm
  :> Post '[JSON] String
-}

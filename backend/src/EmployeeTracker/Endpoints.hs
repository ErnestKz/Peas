{-# language DataKinds #-}
{-# LANGUAGE StandaloneKindSignatures #-}

module EmployeeTracker.Endpoints where

import EmployeeTracker.Prelude
import EmployeeTracker.DatabaseOperations

import Servant.API
import Servant.Auth.Server

type PrivateEmployeeEndpoints
  = "employee" :> Auth '[JWT] () :> EmployeeEndpoints

type PublicEmployeeEndpoints
  = "employee" :>  EmployeeEndpoints  

type EmployeeEndpoints = 
  (Get '[JSON] [Employee]
    :<|> (ReqBody '[JSON] (NewEmployee)
           :> PostNoContent)
    
    :<|> (Capture "employeeid" Text
           :> ReqBody '[JSON] (UpdateEmployee)
           :> PutNoContent)
    
    :<|> (Capture "employeeid" Text
           :> DeleteNoContent))
{-
type AuthenticateEndpoint
  = "authenticate"
  :> ReqBody '[JSON] LoginForm
  :> Post '[JSON] String
-}

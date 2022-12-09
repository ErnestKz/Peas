{-# language TemplateHaskell #-}
{-# language DataKinds #-}
{-# language OverloadedStrings #-}

module Peas.Elm where

import Peas.Prelude
import Peas.DatabaseOperations
import Peas.Endpoints

import Servant ( NoContent )
import Database.PostgreSQL.Simple.Time (Unbounded)
import Data.Time.Calendar.OrdinalDate (Day)

import Elm.Module
import Elm.Derive as E
import Servant.Elm as SE

import Elm.TyRep

instance IsElmDefinition Day where
  compileElmDef _ =
    ETypePrimAlias $ EPrimAlias (ETypeName "Day" []) (ETyCon $ ETCon "String")

instance IsElmDefinition UUID where
  compileElmDef _ =
    ETypePrimAlias $ EPrimAlias (ETypeName "UUID" []) (ETyCon $ ETCon "String")

deriveElmDef SE.defaultOptions ''NoContent
deriveElmDef SE.defaultOptions ''Employee
deriveElmDef SE.defaultOptions ''NewEmployee
deriveElmDef SE.defaultOptions ''UpdateEmployee

elmGenerate :: IO ()
elmGenerate = print "Running Generator:" >>
  generateElmModuleWith
    defElmOptions [ "Generated", "EmployeeTracker" ]
    defElmImports "../frontend/src/"
    [ DefineElm (Proxy :: Proxy NoContent)

    , DefineElm (Proxy :: Proxy (UUID))
    , DefineElm (Proxy :: Proxy (Day))
    
    , DefineElm (Proxy :: Proxy (Employee))
    , DefineElm (Proxy :: Proxy (NewEmployee))
    , DefineElm (Proxy :: Proxy (UpdateEmployee))
    ] (Proxy :: Proxy PublicEmployeeEndpoints)

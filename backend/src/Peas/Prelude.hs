module Peas.Prelude
  ( U.fromText
  , U.toText
  , U.UUID

  , T.Text

  , PG.Date
  , Day) where

import qualified Data.Text as T
import qualified Data.UUID as U
import qualified Database.PostgreSQL.Simple.Time as PG
import Data.Time.Calendar.OrdinalDate (Day)

import GHC.Generics ( Generic )
import Data.Aeson
import Database.PostgreSQL.Simple

deriving instance Generic PG.Date
instance ToJSON PG.Date
instance FromJSON PG.Date

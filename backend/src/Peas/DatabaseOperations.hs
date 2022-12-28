{-# LANGUAGE OverloadedStrings #-}

module Peas.DatabaseOperations where

import Peas.Prelude

import Database.PostgreSQL.Simple

import Control.Monad.Reader
import GHC.Generics ( Generic )
import Data.Aeson


type DB = ReaderT Connection IO
  
-- Get all employees.
getEmployeesQuery :: Query
getEmployeesQuery
  = "SELECT employee_id, firstname, lastname, dob, email, skill_level, active, ((EXTRACT(YEAR FROM (AGE(dob)))) :: Integer) AS age "
  <> "FROM employees_table;"

data Employee = Employee
  { employee_id :: UUID
  , firstname :: Maybe Text
  , lastname :: Maybe Text
  , dob :: Maybe Day
  , email :: Maybe Text
  , skill :: UUID
  , active :: Maybe Bool
  , age :: Maybe Int }
  deriving ( Show, Generic )

instance ToRow (Employee)
instance FromRow (Employee)

instance ToJSON (Employee)
instance FromJSON (Employee)

getEmployees :: DB [ Employee ]
getEmployees = do
  conn <- ask
  liftIO $ query_ conn getEmployeesQuery

-- Insert a new employee.
postEmployeeQuery :: Query
postEmployeeQuery
  = "insert into employees_table (firstname, lastname, dob, email, skill_level, active)"
  <> "values (?)"

data NewEmployee = NewEmployee
  { new_firstname :: Maybe Text
  , new_lastname :: Maybe Text
  , new_dob :: Maybe Day
  , new_email :: Maybe Text
  , new_skill_id :: UUID
  , new_active :: Maybe Bool }
  deriving ( Show, Generic )

instance ToRow NewEmployee
instance FromRow NewEmployee

instance ToJSON NewEmployee
instance FromJSON NewEmployee

postEmployee :: NewEmployee -> DB ()
postEmployee newEmployee = do
  conn <- ask
  liftIO $ execute conn postEmployeeQuery newEmployee
  pure ()
         
-- Update an existing employee.
putEmployeeQuery :: Query
putEmployeeQuery
  = "insert into employees_table (employee_id, firstname, lastname, dob, email, skill_level, active)"
  <> "values (?)"
  <> "ON CONFLICT (employee_id) DO UPDATE"
  <> "SET firstname = excluded.firstname,"
    <> "lastname = excluded.lastname,"
    <> "dob = excluded.dob,"
    <> "email = excluded.email,"
    <> "skill_level = excluded.skill_level,"
    <> "active = excluded.active;"

data UpdateEmployee = UpdateEmployee
  { up_employee_id :: UUID
  , up_firstname :: Maybe Text
  , up_lastname :: Maybe Text
  , up_dob :: Maybe Day
  , up_email :: Maybe Text
  , up_skill_id :: UUID
  , up_active :: Maybe Bool }
  deriving ( Show, Generic )

instance ToRow UpdateEmployee
instance FromRow UpdateEmployee

instance ToJSON UpdateEmployee
instance FromJSON UpdateEmployee


putEmployee :: UpdateEmployee -> DB ()
putEmployee updatedEmployee =
  do conn <- ask
     liftIO $ execute conn putEmployeeQuery updatedEmployee
     pure ()

-- Delete an employee.
deleteEmployeeQuery :: Query
deleteEmployeeQuery
  = "delete from employees_table"
  <> "where employee_id = ?;"

deleteEmployee :: Text -> DB ()
deleteEmployee employeeId = do
  conn <- ask
  liftIO $ execute conn deleteEmployeeQuery (Only employeeId)
  pure ()


-- Authenticate login.
authenticateQuery :: Query
authenticateQuery = "select (password = crypt(?, password)) as pswmatch from users_table where username=?;"

data UserLogin = UserLogin
  { username :: Text
  , password :: Text
  } deriving ( Show, Generic )

instance ToRow UserLogin
instance FromRow UserLogin

instance ToJSON UserLogin
instance FromJSON UserLogin

authenticateUser :: UserLogin -> DB Bool
authenticateUser userLogin = do
  conn <- ask
  [ Only b ] <- liftIO $ query conn deleteEmployeeQuery [password userLogin, username userLogin]
  pure b


-- Get Skills

getSkillsQuery :: Query
getSkillsQuery
  = "SELECT skill_id, skill_name, skill_description"
  <> " FROM skill_table;"

data Skill = Skill
  { skill_id :: UUID
  , skill_name :: Text
  , skill_description :: Maybe Text
  }
  deriving ( Show, Generic )

instance ToRow (Skill)
instance FromRow (Skill)

instance ToJSON (Skill)
instance FromJSON (Skill)

getSkills :: DB [ Skill ]
getSkills = do
  conn <- ask
  liftIO $ query_ conn getSkillsQuery

module Generated.EmployeeTracker exposing(..)

import Json.Decode
import Json.Encode exposing (Value)
-- The following module comes from bartavelle/json-helpers
import Json.Helpers exposing (..)
import Dict exposing (Dict)
import Set
import Http
import String
import Url.Builder

type NoContent  =
    NoContent 

jsonDecNoContent : Json.Decode.Decoder ( NoContent )
jsonDecNoContent = 
    let jsonDecDictNoContent = Dict.fromList [("NoContent", NoContent)]
    in  decodeSumUnaries "NoContent" jsonDecDictNoContent

jsonEncNoContent : NoContent -> Value
jsonEncNoContent  val =
    case val of
        NoContent -> Json.Encode.string "NoContent"



type alias UUID  = String

jsonDecUUID : Json.Decode.Decoder ( UUID )
jsonDecUUID =
    Json.Decode.string

jsonEncUUID : UUID -> Value
jsonEncUUID  val = Json.Encode.string val



type alias Day  = String

jsonDecDay : Json.Decode.Decoder ( Day )
jsonDecDay =
    Json.Decode.string

jsonEncDay : Day -> Value
jsonEncDay  val = Json.Encode.string val



type alias Employee  =
   { employee_id: UUID
   , firstname: (Maybe String)
   , lastname: (Maybe String)
   , dob: (Maybe Day)
   , email: (Maybe String)
   , skill: UUID
   , active: (Maybe Bool)
   , age: (Maybe Int)
   }

jsonDecEmployee : Json.Decode.Decoder ( Employee )
jsonDecEmployee =
   Json.Decode.succeed (\pemployee_id pfirstname plastname pdob pemail pskill pactive page -> {employee_id = pemployee_id, firstname = pfirstname, lastname = plastname, dob = pdob, email = pemail, skill = pskill, active = pactive, age = page})
   |> required "employee_id" (jsonDecUUID)
   |> fnullable "firstname" (Json.Decode.string)
   |> fnullable "lastname" (Json.Decode.string)
   |> fnullable "dob" (jsonDecDay)
   |> fnullable "email" (Json.Decode.string)
   |> required "skill" (jsonDecUUID)
   |> fnullable "active" (Json.Decode.bool)
   |> fnullable "age" (Json.Decode.int)

jsonEncEmployee : Employee -> Value
jsonEncEmployee  val =
   Json.Encode.object
   [ ("employee_id", jsonEncUUID val.employee_id)
   , ("firstname", (maybeEncode (Json.Encode.string)) val.firstname)
   , ("lastname", (maybeEncode (Json.Encode.string)) val.lastname)
   , ("dob", (maybeEncode (jsonEncDay)) val.dob)
   , ("email", (maybeEncode (Json.Encode.string)) val.email)
   , ("skill", jsonEncUUID val.skill)
   , ("active", (maybeEncode (Json.Encode.bool)) val.active)
   , ("age", (maybeEncode (Json.Encode.int)) val.age)
   ]



type alias NewEmployee  =
   { new_firstname: (Maybe String)
   , new_lastname: (Maybe String)
   , new_dob: (Maybe Day)
   , new_email: (Maybe String)
   , new_skill_id: UUID
   , new_active: (Maybe Bool)
   }

jsonDecNewEmployee : Json.Decode.Decoder ( NewEmployee )
jsonDecNewEmployee =
   Json.Decode.succeed (\pnew_firstname pnew_lastname pnew_dob pnew_email pnew_skill_id pnew_active -> {new_firstname = pnew_firstname, new_lastname = pnew_lastname, new_dob = pnew_dob, new_email = pnew_email, new_skill_id = pnew_skill_id, new_active = pnew_active})
   |> fnullable "new_firstname" (Json.Decode.string)
   |> fnullable "new_lastname" (Json.Decode.string)
   |> fnullable "new_dob" (jsonDecDay)
   |> fnullable "new_email" (Json.Decode.string)
   |> required "new_skill_id" (jsonDecUUID)
   |> fnullable "new_active" (Json.Decode.bool)

jsonEncNewEmployee : NewEmployee -> Value
jsonEncNewEmployee  val =
   Json.Encode.object
   [ ("new_firstname", (maybeEncode (Json.Encode.string)) val.new_firstname)
   , ("new_lastname", (maybeEncode (Json.Encode.string)) val.new_lastname)
   , ("new_dob", (maybeEncode (jsonEncDay)) val.new_dob)
   , ("new_email", (maybeEncode (Json.Encode.string)) val.new_email)
   , ("new_skill_id", jsonEncUUID val.new_skill_id)
   , ("new_active", (maybeEncode (Json.Encode.bool)) val.new_active)
   ]



type alias UpdateEmployee  =
   { up_employee_id: UUID
   , up_firstname: (Maybe String)
   , up_lastname: (Maybe String)
   , up_dob: (Maybe Day)
   , up_email: (Maybe String)
   , up_skill_id: UUID
   , up_active: (Maybe Bool)
   }

jsonDecUpdateEmployee : Json.Decode.Decoder ( UpdateEmployee )
jsonDecUpdateEmployee =
   Json.Decode.succeed (\pup_employee_id pup_firstname pup_lastname pup_dob pup_email pup_skill_id pup_active -> {up_employee_id = pup_employee_id, up_firstname = pup_firstname, up_lastname = pup_lastname, up_dob = pup_dob, up_email = pup_email, up_skill_id = pup_skill_id, up_active = pup_active})
   |> required "up_employee_id" (jsonDecUUID)
   |> fnullable "up_firstname" (Json.Decode.string)
   |> fnullable "up_lastname" (Json.Decode.string)
   |> fnullable "up_dob" (jsonDecDay)
   |> fnullable "up_email" (Json.Decode.string)
   |> required "up_skill_id" (jsonDecUUID)
   |> fnullable "up_active" (Json.Decode.bool)

jsonEncUpdateEmployee : UpdateEmployee -> Value
jsonEncUpdateEmployee  val =
   Json.Encode.object
   [ ("up_employee_id", jsonEncUUID val.up_employee_id)
   , ("up_firstname", (maybeEncode (Json.Encode.string)) val.up_firstname)
   , ("up_lastname", (maybeEncode (Json.Encode.string)) val.up_lastname)
   , ("up_dob", (maybeEncode (jsonEncDay)) val.up_dob)
   , ("up_email", (maybeEncode (Json.Encode.string)) val.up_email)
   , ("up_skill_id", jsonEncUUID val.up_skill_id)
   , ("up_active", (maybeEncode (Json.Encode.bool)) val.up_active)
   ]


getEmployee : (Result Http.Error  ((List Employee))  -> msg) -> Cmd msg
getEmployee toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "employee"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.expectJson toMsg (Json.Decode.list (jsonDecEmployee))
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

postEmployee : NewEmployee -> (Result Http.Error  (NoContent)  -> msg) -> Cmd msg
postEmployee body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "POST"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "employee"
                    ]
                    params
            , body =
                Http.jsonBody (jsonEncNewEmployee body)
            , expect =
                Http.expectJson toMsg jsonDecNoContent
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

putEmployeeByEmployeeid : String -> UpdateEmployee -> (Result Http.Error  (NoContent)  -> msg) -> Cmd msg
putEmployeeByEmployeeid capture_employeeid body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "PUT"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "employee"
                    , (capture_employeeid)
                    ]
                    params
            , body =
                Http.jsonBody (jsonEncUpdateEmployee body)
            , expect =
                Http.expectJson toMsg jsonDecNoContent
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

deleteEmployeeByEmployeeid : String -> (Result Http.Error  (NoContent)  -> msg) -> Cmd msg
deleteEmployeeByEmployeeid capture_employeeid toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "DELETE"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "employee"
                    , (capture_employeeid)
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.expectJson toMsg jsonDecNoContent
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

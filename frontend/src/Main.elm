
module Main exposing (..)

import Browser
import Dict exposing (Dict)
import Html exposing (Html, button, div, input, li, text, ul)
import Html.Attributes exposing (value)
import Html.Events exposing (onClick, onInput)
import Http exposing (Error)

import Util exposing (stringFromBool)

import Generated.EmployeeTracker exposing (..)

type EventMessage = Bing | SendGetEmployees
    
type alias State =
    { st : Int
    , employees : List Employee
    , columnConfig : Dict ColumnIndex ColumnProperties }

type alias ColumnIndex = Int
    
type alias CellContents = Maybe String
    
type ColumnProperties = ColumnProperties
    { width : Int
    , columnName : String
    , extractValue : Employee -> CellContents }

{- need some way to distinguish empty string from nothing -}
columnConfig : Dict ColumnIndex ColumnProperties
columnConfig =
    Dict.fromList
        [ (0, ColumnProperties
               { width = 5
               , columnName = "firstname"
               , extractValue = .firstname })
        , (1, ColumnProperties
               { width = 5
               , columnName = "lastname"
               , extractValue = .lastname })
        , (2, ColumnProperties
               { width = 5
               , columnName = "dob"
               , extractValue = .dob })
        , (3, ColumnProperties
               { width = 5
               , columnName = "email"
               , extractValue = .email })
        , (4, ColumnProperties
               { width = 5
               , columnName = "active"
               , extractValue = (Maybe.map stringFromBool) << .active })
        ]
               
main : Program () State EventMessage
main = Browser.element 
  { init = programInit
  , update = programUpdate
  , view = programView
  , subscriptions = programSubscriptions
  }

-----------------------------------------------------
    
programInit : () -> (State, Cmd EventMessage)
programInit _ =
    ({ st = 0
     , employees = []
     , columnConfig = columnConfig }
    , Cmd.none)

-----------------------------------------------------
    
programUpdate : EventMessage -> State -> (State, Cmd EventMessage)
programUpdate msg state =
    case msg of
        Bing -> ({ state | st = state.st + 1 }, Cmd.none)
        SendGetEmployees -> ( state, getEmployeesCmd )

-----------------------------------------------------
                            
programView : State -> Html EventMessage
programView state =
    ul [] [ (text (String.fromInt state.st))
          , li [] [ button [onClick Bing] [text "Bing"] ]
          , li [] [ button [onClick SendGetEmployees] [text "SendGetEmployees"] ]
          ]

-----------------------------------------------------
        
programSubscriptions : State -> Sub EventMessage
programSubscriptions _ = Sub.none

-------------------------------------------------------------

getEmployeesCmd : Cmd EventMessage
getEmployeesCmd = getEmployee getEmployeesMessage

getEmployeesMessage : Result Error (List Employee) -> EventMessage
getEmployeesMessage _ = Bing


{-
lets make servant serve the elm aswell
because cmd expects to be on the same origin

can probably look up a few examples

-}

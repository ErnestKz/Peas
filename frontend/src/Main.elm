
module Main exposing (..)

import Browser
import Html exposing ( Html, button, div, input, li, text, ul
                           
                     , table, colgroup, col, tbody, thead
                     , tfoot, tr, td, th)


import Html.Attributes exposing (value)
import Html.Events exposing (onClick, onInput)
import Http exposing (Error)

import Dict exposing (Dict, get)
import Maybe exposing (withDefault)

import Util exposing (..)

import Generated.Peas exposing (..)

type EventMessage
    = Bing
      
    | SendGetEmployees
    | ReceiveGetEmployees (List Employee)
    | ErrorGetEmployees
    
type alias State =
    { st : Int
    , employees : List Employee
    , columnConfig : ColumnConfig }

type alias ColumnIndex = Int
type alias RowIndex = Int
type alias CellContents = Maybe String
    
type alias ColumnProperties = { width : Int
                              , columnName : String
                              , extractValue : Employee -> CellContents }
    
type alias ColumnPropertyMap =  Dict ColumnIndex ColumnProperties
    
type alias ColumnConfig = { columnPropertyMap : ColumnPropertyMap
                          , columnOrdering : List ColumnIndex }    

{- need some way to distinguish empty string from nothing -}
initColumnConfig : ColumnConfig
initColumnConfig =
    { columnPropertyMap =
          Dict.fromList
              [ (0, { width = 5
                    , columnName = "firstname"
                    , extractValue = .firstname })
              , (1, { width = 5
                    , columnName = "lastname"
                    , extractValue = .lastname })
              , (2, { width = 5
                    , columnName = "dob"
                    , extractValue = .dob })
              , (3, { width = 5
                    , columnName = "email"
                    , extractValue = .email })
              , (4, { width = 5
                    , columnName = "active"
                    , extractValue = (Maybe.map stringFromBool) << .active })
              ]
    , columnOrdering = [0, 1, 2, 3, 4] }

    
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
     , columnConfig = initColumnConfig }
    , Cmd.none)

-----------------------------------------------------
    
programUpdate : EventMessage -> State -> (State, Cmd EventMessage)
programUpdate msg state =
    case msg of
        Bing -> ({ state | st = state.st + 1 }, Cmd.none)
                
        SendGetEmployees -> ( state, getEmployeesCmd )
        ReceiveGetEmployees emp ->
            ( { state | employees = emp }
            , Cmd.none )
                               
        ErrorGetEmployees -> ( state, Cmd.none )

-----------------------------------------------------
                            
programView : State -> Html EventMessage
programView state =
    div [] [ ul [] [ (text (String.fromInt state.st))
                , li [] [ button [onClick Bing] [text "Bing"] ]
                , li [] [ button [ onClick SendGetEmployees ]
                              [ text "SendGetEmployees" ] ]
                   ]
              
           , table []
               [ thead [] (createColumnHeaders state.columnConfig)
               , tbody [] (createRows state.columnConfig state.employees) ]
           ]

createColumnHeaders : ColumnConfig -> List (Html a)
createColumnHeaders columnConfig =
    List.map (\i -> let colProp = getCrash i columnConfig.columnPropertyMap
                    in (th [] [text colProp.columnName]))
        columnConfig.columnOrdering
    
createRows : ColumnConfig -> List Employee -> List (Html a)
createRows columnConfig employees =
    (List.indexedMap (\i e -> (createRow columnConfig e i)) employees)
    
createRow : ColumnConfig -> Employee -> (RowIndex -> Html a)
createRow columnConfig employee rowIndex =
    tr [] (List.map
               (createCell columnConfig.columnPropertyMap employee)
                columnConfig.columnOrdering)
        
createCell : ColumnPropertyMap -> Employee -> (ColumnIndex -> Html a)
createCell columnPropertyMap employee columnIndex =
    let colProp = getCrash columnIndex columnPropertyMap
        val = colProp.extractValue employee
    in td [] [ text (withDefault "-" val) ]

-----------------------------------------------------
        
programSubscriptions : State -> Sub EventMessage
programSubscriptions _ = Sub.none

-------------------------------------------------------------

getEmployeesCmd : Cmd EventMessage
getEmployeesCmd = getEmployee getEmployeesMessage

getEmployeesMessage : Result Error (List Employee) -> EventMessage
getEmployeesMessage res =
    case res of
        (Ok employees) -> ReceiveGetEmployees employees
        (Err err)      -> ErrorGetEmployees

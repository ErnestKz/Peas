module Util exposing (..)

import Dict exposing (Dict, get)

stringFromBool : Bool -> String
stringFromBool bool =
    case bool of
        True -> "Yes"
        False -> "No"

getCrash : comparable -> Dict comparable v -> v        
getCrash k m = let r = get k m in
               case r of
                   Nothing -> Debug.todo "Key not in map."
                   Just v -> v

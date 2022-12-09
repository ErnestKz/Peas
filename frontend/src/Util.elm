module Util exposing (..)

stringFromBool : Bool -> String
stringFromBool bool =
    case bool of
        True -> "Yes"
        False -> "No"

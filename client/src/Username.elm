module Username exposing (Username(..), toHtml, toString, urlParser)

import Html exposing (Html)
import Url.Parser



-- TYPES


type Username
    = Username String



-- TRANSFORM


toString : Username -> String
toString (Username username) =
    username


urlParser : Url.Parser.Parser (Username -> a) a
urlParser =
    Url.Parser.custom "USERNAME" (\str -> Just (Username str))


toHtml : Username -> Html msg
toHtml (Username username) =
    Html.text username

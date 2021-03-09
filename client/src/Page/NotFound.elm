module Page.NotFound exposing (view)

import Html exposing (Html, h1, main_, text)
import Html.Attributes exposing (class, id, tabindex)



-- VIEW


view : { title : String, content : Html msg }
view =
    { title = "Page Not Found"
    , content =
        main_ []
            [ h1 [] [ text "Not Found" ] ]
    }

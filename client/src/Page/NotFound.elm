module Page.NotFound exposing (view)

import Html exposing (Html, h1, main_, text)



-- VIEW


view : { title : String, content : Html msg }
view =
    { title = "Page Not Found"
    , content =
        main_ []
            [ h1 [] [ text "Not Found" ] ]
    }

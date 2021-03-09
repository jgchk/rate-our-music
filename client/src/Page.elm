module Page exposing (Page(..), view)

import Api
import Browser exposing (Document)
import Html exposing (Html, a, nav, text)
import Html.Attributes exposing (classList)
import Route exposing (Route)
import Session exposing (Session)
import Username


type Page
    = Other
    | Login


view : Session -> Page -> { title : String, content : Html msg } -> Document msg
view session page { title, content } =
    { title = title ++ " - Conduit"
    , body = [ viewHeader page session, content ]
    }


viewHeader : Page -> Session -> Html msg
viewHeader page session =
    nav []
        (navbarLink page Route.Home [ text "Home" ]
            :: viewMenu page session
        )


viewMenu : Page -> Session -> List (Html msg)
viewMenu page session =
    let
        linkTo =
            navbarLink page

        maybeCred =
            Session.cred session
    in
    case maybeCred of
        Just cred ->
            let
                username =
                    Api.username cred
            in
            [ linkTo
                (Route.Profile username)
                [ Username.toHtml username ]
            ]

        Nothing ->
            [ linkTo Route.Login [ text "Sign in" ]
            ]


navbarLink : Page -> Route -> List (Html msg) -> Html msg
navbarLink page route linkContent =
    a [ classList [ ( "active", isActive page route ) ], Route.href route ] linkContent


isActive : Page -> Route -> Bool
isActive page route =
    case ( page, route ) of
        ( Login, Route.Login ) ->
            True

        _ ->
            False

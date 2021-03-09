module Components.Navbar exposing (view)

import Api
import Element exposing (..)
import Element.Font as Font
import Element.Input as Input
import Spa.Generated.Route as Route


view :
    { session : Api.Session
    , onSignIn : msg
    , onSignOut : msg
    }
    -> Element msg
view options =
    row [ spacing 20 ]
        [ link [ Font.color (rgb 0 0.25 0.5), Font.underline ] { url = Route.toString Route.Top, label = text "Homepage" }
        , link [ Font.color (rgb 0 0.25 0.5), Font.underline ] { url = Route.toString Route.NotFound, label = text "Not found" }
        , case options.session of
            Api.LoggedOut ->
                Input.button
                    []
                    { onPress = Just options.onSignIn
                    , label = text "Sign in"
                    }

            Api.LoggingIn ->
                text "Logging in..."

            Api.LoggedIn _ ->
                Input.button
                    []
                    { onPress = Just options.onSignOut
                    , label = text "Sign out"
                    }

            Api.LoggingOut ->
                text "Logging out..."
        ]

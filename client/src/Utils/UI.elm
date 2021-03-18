module Utils.UI exposing (animated, font, icon, onEnter, spacing)

import Element exposing (..)
import FeatherIcons
import Html.Events
import Json.Decode as Decode
import Simple.Animation
import Simple.Animation.Animated


font : Int -> Int
font =
    modular 16 2 >> round


spacing : Int -> Int
spacing =
    modular 2 2 >> round


icon : FeatherIcons.Icon -> Element msg
icon i =
    i |> FeatherIcons.toHtml [] |> Element.html


onEnter : msg -> Attribute msg
onEnter msg =
    htmlAttribute
        (Html.Events.on "keyup"
            (Decode.field "key" Decode.string
                |> Decode.andThen
                    (\key ->
                        if key == "Enter" then
                            Decode.succeed msg

                        else
                            Decode.fail "Not the enter key"
                    )
            )
        )


animated : (List (Attribute msg) -> children -> Element msg) -> Simple.Animation.Animation -> List (Attribute msg) -> children -> Element msg
animated =
    Simple.Animation.Animated.ui
        { behindContent = behindContent
        , htmlAttribute = htmlAttribute
        , html = html
        }

module Utils.UI exposing (font, icon, onEnter, spacing)

import Element
import FeatherIcons
import Html.Events
import Json.Decode as Decode


font : Int -> Int
font =
    Element.modular 16 2 >> round


spacing : Int -> Int
spacing =
    Element.modular 2 2 >> round


icon : FeatherIcons.Icon -> Element.Element msg
icon i =
    i |> FeatherIcons.toHtml [] |> Element.html


onEnter : msg -> Element.Attribute msg
onEnter msg =
    Element.htmlAttribute
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

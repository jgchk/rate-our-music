module Utils.UI exposing (font, icon, spacing)

import Element
import FeatherIcons


font : Int -> Int
font =
    Element.modular 16 2 >> round


spacing : Int -> Int
spacing =
    Element.modular 2 2 >> round


icon : FeatherIcons.Icon -> Element.Element msg
icon i =
    i |> FeatherIcons.toHtml [] |> Element.html

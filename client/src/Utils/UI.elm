module Utils.UI exposing (font, spacing)

import Element


font : Int -> Int
font =
    Element.modular 16 2 >> round


spacing : Int -> Int
spacing =
    Element.modular 2 2 >> round

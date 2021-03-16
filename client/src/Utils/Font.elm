module Utils.Font exposing (scaled)

import Element


scaled : Int -> Int
scaled =
    Element.modular 16 2 >> round

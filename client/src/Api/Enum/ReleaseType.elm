-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Api.Enum.ReleaseType exposing (..)

import Json.Decode as Decode exposing (Decoder)


type ReleaseType
    = Album
    | Compilation
    | Ep
    | Single
    | Mixtape
    | DjMix
    | Bootleg
    | Video


list : List ReleaseType
list =
    [ Album, Compilation, Ep, Single, Mixtape, DjMix, Bootleg, Video ]


decoder : Decoder ReleaseType
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "ALBUM" ->
                        Decode.succeed Album

                    "COMPILATION" ->
                        Decode.succeed Compilation

                    "EP" ->
                        Decode.succeed Ep

                    "SINGLE" ->
                        Decode.succeed Single

                    "MIXTAPE" ->
                        Decode.succeed Mixtape

                    "DJ_MIX" ->
                        Decode.succeed DjMix

                    "BOOTLEG" ->
                        Decode.succeed Bootleg

                    "VIDEO" ->
                        Decode.succeed Video

                    _ ->
                        Decode.fail ("Invalid ReleaseType type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : ReleaseType -> String
toString enum____ =
    case enum____ of
        Album ->
            "ALBUM"

        Compilation ->
            "COMPILATION"

        Ep ->
            "EP"

        Single ->
            "SINGLE"

        Mixtape ->
            "MIXTAPE"

        DjMix ->
            "DJ_MIX"

        Bootleg ->
            "BOOTLEG"

        Video ->
            "VIDEO"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe ReleaseType
fromString enumString____ =
    case enumString____ of
        "ALBUM" ->
            Just Album

        "COMPILATION" ->
            Just Compilation

        "EP" ->
            Just Ep

        "SINGLE" ->
            Just Single

        "MIXTAPE" ->
            Just Mixtape

        "DJ_MIX" ->
            Just DjMix

        "BOOTLEG" ->
            Just Bootleg

        "VIDEO" ->
            Just Video

        _ ->
            Nothing

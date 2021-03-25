-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Api.Enum.LogLevel exposing (..)

import Json.Decode as Decode exposing (Decoder)


type LogLevel
    = Critical
    | Error
    | Warning
    | Info
    | Debug


list : List LogLevel
list =
    [ Critical, Error, Warning, Info, Debug ]


decoder : Decoder LogLevel
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "CRITICAL" ->
                        Decode.succeed Critical

                    "ERROR" ->
                        Decode.succeed Error

                    "WARNING" ->
                        Decode.succeed Warning

                    "INFO" ->
                        Decode.succeed Info

                    "DEBUG" ->
                        Decode.succeed Debug

                    _ ->
                        Decode.fail ("Invalid LogLevel type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : LogLevel -> String
toString enum____ =
    case enum____ of
        Critical ->
            "CRITICAL"

        Error ->
            "ERROR"

        Warning ->
            "WARNING"

        Info ->
            "INFO"

        Debug ->
            "DEBUG"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe LogLevel
fromString enumString____ =
    case enumString____ of
        "CRITICAL" ->
            Just Critical

        "ERROR" ->
            Just Error

        "WARNING" ->
            Just Warning

        "INFO" ->
            Just Info

        "DEBUG" ->
            Just Debug

        _ ->
            Nothing

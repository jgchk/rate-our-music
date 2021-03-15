-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Api.Object.ReleaseDate exposing (..)

import Api.InputObject
import Api.Interface
import Api.Object
import Api.Scalar
import Api.ScalarCodecs
import Api.Union
import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode


year : SelectionSet Int Api.Object.ReleaseDate
year =
    Object.selectionForField "Int" "year" [] Decode.int


month : SelectionSet (Maybe Int) Api.Object.ReleaseDate
month =
    Object.selectionForField "(Maybe Int)" "month" [] (Decode.int |> Decode.nullable)


day : SelectionSet (Maybe Int) Api.Object.ReleaseDate
day =
    Object.selectionForField "(Maybe Int)" "day" [] (Decode.int |> Decode.nullable)

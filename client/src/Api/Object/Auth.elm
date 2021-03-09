-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Api.Object.Auth exposing (..)

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


token : SelectionSet String Api.Object.Auth
token =
    Object.selectionForField "String" "token" [] Decode.string


exp : SelectionSet Int Api.Object.Auth
exp =
    Object.selectionForField "Int" "exp" [] Decode.int


account :
    SelectionSet decodesTo Api.Object.Account
    -> SelectionSet decodesTo Api.Object.Auth
account object____ =
    Object.selectionForCompositeField "account" [] object____ identity

-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Api.Object.AccountMutation exposing (..)

import Api.Enum.Role
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


type alias CreateRequiredArguments =
    { username : String
    , password : String
    , roles : List Api.Enum.Role.Role
    }


create :
    CreateRequiredArguments
    -> SelectionSet decodesTo Api.Object.Auth
    -> SelectionSet decodesTo Api.Object.AccountMutation
create requiredArgs____ object____ =
    Object.selectionForCompositeField "create" [ Argument.required "username" requiredArgs____.username Encode.string, Argument.required "password" requiredArgs____.password Encode.string, Argument.required "roles" requiredArgs____.roles (Encode.enum Api.Enum.Role.toString |> Encode.list) ] object____ identity


type alias LoginRequiredArguments =
    { username : String
    , password : String
    }


login :
    LoginRequiredArguments
    -> SelectionSet decodesTo Api.Object.Auth
    -> SelectionSet decodesTo Api.Object.AccountMutation
login requiredArgs____ object____ =
    Object.selectionForCompositeField "login" [ Argument.required "username" requiredArgs____.username Encode.string, Argument.required "password" requiredArgs____.password Encode.string ] object____ identity


type alias LogoutRequiredArguments =
    { force : Bool }


logout :
    LogoutRequiredArguments
    -> SelectionSet Bool Api.Object.AccountMutation
logout requiredArgs____ =
    Object.selectionForField "Bool" "logout" [ Argument.required "force" requiredArgs____.force Encode.bool ] Decode.bool


refreshAuth :
    SelectionSet decodesTo Api.Object.Auth
    -> SelectionSet decodesTo Api.Object.AccountMutation
refreshAuth object____ =
    Object.selectionForCompositeField "refreshAuth" [] object____ identity
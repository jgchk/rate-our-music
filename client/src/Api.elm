module Api exposing (Cred, Error, Response, id, login, refresh, refreshTask, username)

import Api.Mutation as Mutation
import Api.Object
import Api.Object.Account as ObjAccount
import Api.Object.Auth as ObjAuth
import Graphql.Http
import Graphql.Http.GraphqlError
import Graphql.SelectionSet as SelectionSet
import Platform exposing (Task)
import RemoteData
import Task
import Username exposing (Username(..))



-- CRED


type alias Cred =
    { token : String
    , exp : Int
    , account : Account
    }


type alias Account =
    { id : Int
    , username : Username
    }


id : Cred -> Int
id cred =
    cred.account.id


username : Cred -> Username
username cred =
    cred.account.username



-- REQUESTS


type alias Response decodesTo =
    RemoteData.RemoteData Error decodesTo


type alias ResponseMsg decodesTo msg =
    Response decodesTo -> msg


send : ResponseMsg decodesTo msg -> Graphql.Http.Request decodesTo -> Cmd msg
send toMsg =
    Graphql.Http.send ((\res -> RemoteData.fromResult res |> RemoteData.mapError decodeError) >> toMsg)


login : String -> String -> ResponseMsg Cred msg -> Cmd msg
login user pass cmd =
    let
        credSelection =
            SelectionSet.map3 Cred
                ObjAuth.token
                ObjAuth.exp
                (ObjAuth.account accountSelection)

        accountSelection =
            SelectionSet.map2 Account
                ObjAccount.id
                (ObjAccount.username |> mapUsername)

        mapUsername =
            SelectionSet.map (\u -> Username u)

        loginMutation =
            Mutation.login { username = user, password = pass } credSelection
    in
    loginMutation
        |> Graphql.Http.mutationRequest "https://localhost:3030/graphql"
        |> send cmd


refresh : ResponseMsg Cred msg -> Cmd msg
refresh cmd =
    let
        credSelection =
            SelectionSet.map3 Cred
                ObjAuth.token
                ObjAuth.exp
                (ObjAuth.account accountSelection)

        accountSelection =
            SelectionSet.map2 Account
                ObjAccount.id
                (ObjAccount.username |> mapUsername)

        mapUsername =
            SelectionSet.map (\u -> Username u)

        refreshMutation =
            Mutation.refreshAuth credSelection
    in
    refreshMutation
        |> Graphql.Http.mutationRequest "https://localhost:3030/graphql"
        |> send cmd


refreshTask : Task.Task Error Cred
refreshTask =
    let
        credSelection =
            SelectionSet.map3 Cred
                ObjAuth.token
                ObjAuth.exp
                (ObjAuth.account accountSelection)

        accountSelection =
            SelectionSet.map2 Account
                ObjAccount.id
                (ObjAccount.username |> mapUsername)

        mapUsername =
            SelectionSet.map (\u -> Username u)

        refreshMutation =
            Mutation.refreshAuth credSelection
    in
    refreshMutation
        |> Graphql.Http.mutationRequest "https://localhost:3030/graphql"
        |> Graphql.Http.toTask
        |> Task.mapError decodeError



-- ERRORS


type GraphqlError
    = InvalidCredentialsError
    | GraphqlError Graphql.Http.GraphqlError.GraphqlError


type Error
    = GraphqlErrors (List GraphqlError)
    | HttpError Graphql.Http.HttpError


decodeError : Graphql.Http.Error parsedData -> Error
decodeError error =
    case error of
        Graphql.Http.GraphqlError _ graphqlErrors ->
            GraphqlErrors
                (List.map
                    (\graphqlError ->
                        case graphqlError.message of
                            "invalid credentials" ->
                                InvalidCredentialsError

                            _ ->
                                GraphqlError graphqlError
                    )
                    graphqlErrors
                )

        Graphql.Http.HttpError httpError ->
            HttpError httpError

module Api exposing (Cred, Error, Response, Session(..), id, login, logout, refresh, username)

import Api.Mutation as Mutation
import Api.Object
import Api.Object.Account as ObjAccount
import Api.Object.Auth as ObjAuth
import Graphql.Http
import Graphql.Http.GraphqlError
import Graphql.SelectionSet as SelectionSet
import Process
import RemoteData
import Task
import Time



-- CRED


type Session
    = LoggedOut
    | LoggingIn
    | LoggedIn Cred
    | LoggingOut


type alias Cred =
    { token : String
    , exp : Int
    , account : Account
    }


type alias Account =
    { id : Int
    , username : String
    }


id : Cred -> Int
id cred =
    cred.account.id


username : Cred -> String
username cred =
    cred.account.username



-- REQUESTS


type alias Response decodesTo =
    RemoteData.RemoteData Error decodesTo


type alias ResponseToMsg decodesTo msg =
    Response decodesTo -> msg


send : ResponseToMsg decodesTo msg -> Graphql.Http.Request decodesTo -> Cmd msg
send toMsg =
    Graphql.Http.send ((\res -> RemoteData.fromResult res |> RemoteData.mapError decodeError) >> toMsg)


login : String -> String -> ResponseToMsg Cred msg -> Cmd msg
login user pass toMsg =
    let
        credSelection =
            SelectionSet.map3 Cred
                ObjAuth.token
                ObjAuth.exp
                (ObjAuth.account accountSelection)

        accountSelection =
            SelectionSet.map2 Account
                ObjAccount.id
                ObjAccount.username

        loginMutation =
            Mutation.login { username = user, password = pass } credSelection
    in
    loginMutation
        |> Graphql.Http.mutationRequest "/graphql"
        |> send toMsg


logout : Bool -> Cred -> ResponseToMsg Bool msg -> Cmd msg
logout force cred toMsg =
    let
        logoutMutation =
            Mutation.logout { force = force }
    in
    logoutMutation
        |> Graphql.Http.mutationRequest "/graphql"
        |> Graphql.Http.withHeader "authorization" ("Bearer " ++ cred.token)
        |> send toMsg


refresh : Maybe Cred -> (Response Cred -> msg) -> Cmd msg
refresh maybeCred toMsg =
    let
        refreshBase =
            let
                credSelection =
                    SelectionSet.map3 Cred
                        ObjAuth.token
                        ObjAuth.exp
                        (ObjAuth.account accountSelection)

                accountSelection =
                    SelectionSet.map2 Account
                        ObjAccount.id
                        ObjAccount.username

                refreshMutation =
                    Mutation.refreshAuth credSelection
            in
            refreshMutation
                |> Graphql.Http.mutationRequest "/graphql"
    in
    case maybeCred of
        Just cred ->
            Time.now
                |> Task.andThen
                    (\time ->
                        let
                            nowMillis =
                                Time.posixToMillis time

                            expMillis =
                                cred.exp * 1000

                            sleepFor =
                                toFloat (expMillis - nowMillis)
                        in
                        Process.sleep sleepFor
                    )
                |> Task.andThen
                    (always <|
                        (refreshBase
                            |> Graphql.Http.toTask
                            |> Task.mapError decodeError
                        )
                    )
                |> RemoteData.fromTask
                |> Task.perform identity
                |> Cmd.map toMsg

        Nothing ->
            refreshBase
                |> send toMsg



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

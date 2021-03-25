module Shared exposing
    ( Flags
    , Model
    , Msg
    , init
    , subscriptions
    , update
    , view
    )

import Api exposing (Account, Auth)
import Api.Enum.LogEnvironment
import Api.Mutation
import Api.Object
import Api.Object.Account as ObjAccount
import Api.Object.AccountMutation
import Api.Object.Auth as ObjAuth
import Api.Object.Log exposing (environment)
import Browser.Navigation exposing (Key)
import Components.Navbar as Navbar
import Constants
import Element exposing (..)
import Graphql.OptionalArgument
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, with)
import Json.Decode
import Process
import RemoteData exposing (RemoteData(..))
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Task
import Time
import Url exposing (Url)
import Utils.Log
import Utils.Route



-- INIT


type alias Flags =
    ()


type alias Model =
    { url : Url
    , key : Key
    , session : Api.Session
    , environment : Api.Enum.LogEnvironment.LogEnvironment
    }


init : Flags -> Url -> Key -> ( Model, Cmd Msg )
init _ url key =
    let
        session =
            Api.LoggingIn

        ( environment, cmd ) =
            case Json.Decode.decodeString Api.Enum.LogEnvironment.decoder ("\"" ++ Constants.environment ++ "\"") of
                Ok env ->
                    ( env, Cmd.none )

                Err reason ->
                    let
                        env =
                            Api.Enum.LogEnvironment.Unknown
                    in
                    ( env
                    , Utils.Log.error env
                        LogRequest
                        { scope = "Shared.elm"
                        , message = "Could not parse environment"
                        , name = "DecodeError"
                        , data = Graphql.OptionalArgument.Present (Json.Decode.errorToString reason)
                        }
                        session
                    )
    in
    ( { url = url
      , key = key
      , session = session
      , environment = environment
      }
    , Cmd.batch [ refresh session, cmd ]
    )



-- UPDATE


type Msg
    = Register
    | Login
    | Logout
    | LoginRequest (Api.Response AuthMutation)
    | RefreshRequest (Api.Response AuthMutation)
    | LogoutRequest (Api.Response LogoutMutation)
    | LogRequest (Api.Response Utils.Log.LogMutation)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Register ->
            ( model, Utils.Route.navigate model.key Route.Account__Register )

        Login ->
            ( model, Utils.Route.navigate model.key Route.Account__Login )

        Logout ->
            case model.session of
                Api.LoggedIn _ ->
                    ( { model | session = Api.LoggingOut }
                    , logout { force = False } model.session
                    )

                _ ->
                    ( { model | session = Api.LoggedOut }
                    , Cmd.none
                    )

        LoginRequest response ->
            case response of
                Ok (AuthMutation auth) ->
                    let
                        session =
                            Api.LoggedIn auth
                    in
                    ( { model | session = session }, refresh session )

                Err _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

        RefreshRequest response ->
            case response of
                Ok (AuthMutation auth) ->
                    let
                        session =
                            Api.LoggedIn auth
                    in
                    ( { model | session = session }, refresh session )

                Err _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

        LogoutRequest response ->
            case response of
                Ok _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

                Err _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

        LogRequest _ ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view :
    { page : Document msg, toMsg : Msg -> msg }
    -> Model
    -> Document msg
view { page, toMsg } model =
    { title = page.title
    , body =
        [ column [ padding 20, spacing 20, height fill, width fill ]
            [ Navbar.view
                { session = model.session
                , onSignIn = toMsg Login
                , onSignUp = toMsg Register
                , onSignOut = toMsg Logout
                }
            , column [ height fill, width fill ] page.body
            ]
        ]
    }



-- REQUESTS


type AuthMutation
    = AuthMutation Auth


type LogoutMutation
    = LogoutMutation Bool


credSelection : SelectionSet Auth Api.Object.Auth
credSelection =
    let
        accountSelection =
            SelectionSet.succeed Account
                |> with ObjAccount.id
                |> with ObjAccount.username
    in
    SelectionSet.succeed Auth
        |> with ObjAuth.token
        |> with ObjAuth.exp
        |> with (ObjAuth.account accountSelection)


logout : Api.Object.AccountMutation.LogoutRequiredArguments -> Api.Session -> Cmd Msg
logout args =
    let
        rootSelection =
            SelectionSet.succeed LogoutMutation
                |> with (Api.Object.AccountMutation.logout args)
    in
    Api.sendMutation LogoutRequest (Api.Mutation.account rootSelection)


refresh : Api.Session -> Cmd Msg
refresh session =
    let
        rootSelection =
            SelectionSet.succeed AuthMutation
                |> with (Api.Object.AccountMutation.refreshAuth credSelection)
    in
    case Api.auth session of
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
                    (Api.Mutation.account rootSelection
                        |> Api.mutationRequest
                        |> Api.withSession session
                        |> Api.sendTask
                        |> always
                    )
                |> Task.attempt identity
                |> Cmd.map RefreshRequest

        Nothing ->
            Api.sendMutation RefreshRequest (Api.Mutation.account rootSelection) session

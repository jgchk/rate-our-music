module Session exposing (Msg(..), Session(..), cred, init, navKey, update)

import Api exposing (Cred, Response, refreshTask)
import Browser.Navigation as Nav
import Process
import RemoteData exposing (RemoteData(..))
import Task
import Time



-- MODEL


type Session
    = LoggedOut Nav.Key
    | RefreshingLoggedOut Nav.Key
    | LoggingIn Nav.Key
    | LoggedIn Nav.Key Cred
    | RefreshingLoggedIn Nav.Key Cred
    | LoggingOut Nav.Key Cred


init : Nav.Key -> ( Session, Cmd Msg )
init key =
    ( LoggedOut key, Api.refresh RefreshRequest )


cred : Session -> Maybe Cred
cred session =
    case session of
        LoggedOut _ ->
            Nothing

        RefreshingLoggedOut _ ->
            Nothing

        LoggingIn _ ->
            Nothing

        LoggedIn _ val ->
            Just val

        RefreshingLoggedIn _ val ->
            Just val

        LoggingOut _ val ->
            Just val


navKey : Session -> Nav.Key
navKey session =
    case session of
        LoggedOut key ->
            key

        RefreshingLoggedOut key ->
            key

        LoggingIn key ->
            key

        LoggedIn key _ ->
            key

        RefreshingLoggedIn key _ ->
            key

        LoggingOut key _ ->
            key



-- UPDATE


type Msg
    = RefreshRequest (Response Cred)
    | LoginRequest (Response Cred)


update : Msg -> Session -> ( Session, Cmd Msg )
update msg model =
    case msg of
        RefreshRequest data ->
            case data of
                NotAsked ->
                    ( model, Cmd.none )

                Loading ->
                    case model of
                        LoggedOut key ->
                            ( RefreshingLoggedOut key, Cmd.none )

                        RefreshingLoggedOut key ->
                            ( RefreshingLoggedOut key, Cmd.none )

                        LoggingIn key ->
                            ( RefreshingLoggedOut key, Cmd.none )

                        LoggedIn key val ->
                            ( RefreshingLoggedIn key val, Cmd.none )

                        RefreshingLoggedIn key val ->
                            ( RefreshingLoggedIn key val, Cmd.none )

                        LoggingOut key val ->
                            ( RefreshingLoggedIn key val, Cmd.none )

                Failure _ ->
                    ( LoggedOut (navKey model), Cmd.none )

                Success newCred ->
                    ( LoggedIn (navKey model) newCred, refresh newCred )

        LoginRequest data ->
            case data of
                NotAsked ->
                    ( model, Cmd.none )

                Loading ->
                    ( LoggingIn (navKey model), Cmd.none )

                Failure _ ->
                    ( LoggedOut (navKey model), Cmd.none )

                Success newCred ->
                    ( LoggedIn (navKey model) newCred, refresh newCred )


refresh : Cred -> Cmd Msg
refresh cred_ =
    Time.now
        |> Task.andThen
            (\time ->
                let
                    nowMillis =
                        Time.posixToMillis time

                    expMillis =
                        cred_.exp * 1000

                    sleepFor =
                        toFloat (expMillis - nowMillis)
                in
                Process.sleep sleepFor
            )
        |> Task.andThen (always <| refreshTask)
        |> RemoteData.fromTask
        |> Task.perform identity
        |> Cmd.map RefreshRequest

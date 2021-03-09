module Shared exposing
    ( Flags
    , Model
    , Msg
    , init
    , subscriptions
    , update
    , view
    )

import Api
import Browser.Navigation exposing (Key)
import Components.Navbar as Navbar
import Element exposing (..)
import RemoteData exposing (RemoteData(..))
import Spa.Document exposing (Document)
import Url exposing (Url)



-- INIT


type alias Flags =
    ()


type alias Model =
    { url : Url
    , key : Key
    , session : Api.Session
    }


init : Flags -> Url -> Key -> ( Model, Cmd Msg )
init _ url key =
    ( Model url key Api.LoggedOut
    , Api.refresh Nothing RefreshRequest
    )



-- UPDATE


type Msg
    = Login
    | LoginRequest (Api.Response Api.Cred)
    | RefreshRequest (Api.Response Api.Cred)
    | Logout
    | LogoutRequest (Api.Response Bool)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Login ->
            ( { model | session = Api.LoggingIn }
            , Api.login "user1" "pass1" LoginRequest
            )

        LoginRequest remoteData ->
            case remoteData of
                RemoteData.NotAsked ->
                    ( model, Cmd.none )

                RemoteData.Loading ->
                    ( { model | session = Api.LoggingIn }, Cmd.none )

                RemoteData.Failure _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

                RemoteData.Success cred ->
                    ( { model | session = Api.LoggedIn cred }, Api.refresh (Just cred) RefreshRequest )

        RefreshRequest remoteData ->
            case remoteData of
                RemoteData.NotAsked ->
                    ( model, Cmd.none )

                RemoteData.Loading ->
                    ( model, Cmd.none )

                RemoteData.Failure _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

                RemoteData.Success cred ->
                    ( { model | session = Api.LoggedIn cred }, Api.refresh (Just cred) RefreshRequest )

        Logout ->
            case model.session of
                Api.LoggedIn cred ->
                    ( { model | session = Api.LoggingOut }
                    , Api.logout False cred LogoutRequest
                    )

                _ ->
                    ( { model | session = Api.LoggedOut }
                    , Cmd.none
                    )

        LogoutRequest remoteData ->
            case remoteData of
                RemoteData.NotAsked ->
                    ( model, Cmd.none )

                RemoteData.Loading ->
                    ( { model | session = Api.LoggingOut }, Cmd.none )

                RemoteData.Failure _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )

                RemoteData.Success _ ->
                    ( { model | session = Api.LoggedOut }, Cmd.none )


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
        [ column [ padding 20, spacing 20, height fill ]
            [ Navbar.view
                { session = model.session
                , onSignIn = toMsg Login
                , onSignOut = toMsg Logout
                }
            , column [ height fill ] page.body
            ]
        ]
    }

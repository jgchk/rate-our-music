module Router exposing (Model, Msg(..), init, update, view)

import Browser exposing (Document)
import Browser.Navigation as Nav
import Html
import Page
import Page.Home as Home
import Page.Login as Login
import Page.NotFound as NotFound
import Page.Profile as Profile
import Route exposing (Route)
import Session exposing (Session(..))
import Url exposing (Url)



-- MODEL


type Model
    = NotFound
    | Home
    | Login Login.Model
    | Profile


init : Url -> ( Model, Cmd Msg )
init url =
    changeRouteTo (Route.fromUrl url)



-- VIEW


view : Session -> Model -> Document Msg
view session model =
    let
        viewPage page toMsg config =
            let
                { title, body } =
                    Page.view session page config
            in
            { title = title
            , body = List.map (Html.map toMsg) body
            }
    in
    case model of
        NotFound ->
            Page.view session Page.Other NotFound.view

        Home ->
            Page.view session Page.Other Home.view

        Login login ->
            viewPage Page.Login GotLoginMsg (Login.view session login)

        Profile ->
            Page.view session Page.Other Profile.view



-- UPDATE


type Msg
    = ChangedUrl Url
    | ClickedLink Browser.UrlRequest
    | GotLoginMsg Login.Msg


changeRouteTo : Maybe Route -> ( Model, Cmd Msg )
changeRouteTo maybeRoute =
    case maybeRoute of
        Nothing ->
            ( NotFound, Cmd.none )

        Just Route.Login ->
            let
                ( loginModel, loginCmd ) =
                    Login.init
            in
            ( Login loginModel, Cmd.map GotLoginMsg loginCmd )

        Just Route.Home ->
            ( Home, Cmd.none )

        Just (Route.Profile id) ->
            ( Profile, Cmd.none )


update : Msg -> Session -> Model -> ( Model, Cmd Msg )
update msg session model =
    case ( msg, model ) of
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    case url.fragment of
                        Nothing ->
                            -- If we got a link that didn't include a fragment,
                            -- it's from one of those (href "") attributes that
                            -- we have to include to make the RealWorld CSS work.
                            --
                            -- In an application doing path routing instead of
                            -- fragment-based routing, this entire
                            -- `case url.fragment of` expression this comment
                            -- is inside would be unnecessary.
                            ( model, Cmd.none )

                        Just _ ->
                            ( model
                            , Nav.pushUrl (Session.navKey session) (Url.toString url)
                            )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (Route.fromUrl url)

        ( GotLoginMsg subMsg, Login loginModel ) ->
            let
                ( updatedLoginModel, loginCmd ) =
                    Login.update session subMsg loginModel
            in
            ( Login updatedLoginModel, Cmd.map GotLoginMsg loginCmd )

        ( _, _ ) ->
            -- Disregard messages that arrived for the wrong page.
            ( model, Cmd.none )

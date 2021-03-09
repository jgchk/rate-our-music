module Main exposing (main)

import Browser exposing (Document)
import Browser.Navigation as Nav
import Html
import Page.Login as Login exposing (Msg(..))
import RemoteData exposing (RemoteData(..))
import Router exposing (Msg(..))
import Session exposing (Msg(..), Session(..))
import Url exposing (Url)



-- MODEL


type alias Model =
    { session : Session
    , routerModel : Router.Model
    }


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url navKey =
    let
        ( sessionModel, sessionCmd ) =
            Session.init navKey

        ( routerModel, routerCmd ) =
            Router.init url

        model =
            { session = sessionModel, routerModel = routerModel }

        cmd =
            Cmd.batch [ mapCommand GotRouterMsg routerCmd, mapCommand GotSessionMsg sessionCmd ]
    in
    ( model, cmd )



-- VIEW


view : Model -> Document Msg
view model =
    -- Router.view model.session model.routerModel
    let
        { title, body } =
            Router.view model.session model.routerModel
    in
    { title = title
    , body = List.map (Html.map GotRouterMsg) body
    }



-- UPDATE


type Msg
    = GotSessionMsg Session.Msg
    | GotRouterMsg Router.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( GotSessionMsg subMsg, _ ) ->
            let
                ( subModel, subCmd ) =
                    Session.update subMsg model.session

                cmd =
                    mapCommand GotSessionMsg subCmd

                updatedModel =
                    { model | session = subModel }
            in
            ( updatedModel, cmd )

        ( GotRouterMsg subMsg, { routerModel } ) ->
            let
                ( updatedRouterModel, pageCmd ) =
                    Router.update subMsg model.session routerModel

                cmd =
                    mapCommand GotRouterMsg pageCmd

                updatedModel =
                    { model | routerModel = updatedRouterModel }
            in
            case subMsg of
                GotLoginMsg (Login.LoginRequest data) ->
                    let
                        ( updatedSession, sessionCmd ) =
                            Session.update (Session.LoginRequest data) model.session
                    in
                    ( { updatedModel | session = updatedSession }
                    , Cmd.batch [ cmd, Cmd.map GotSessionMsg sessionCmd ]
                    )

                _ ->
                    ( updatedModel, cmd )



-- ( GotLoginMsg subMsg, { pageModel } ) ->
--     let
--         ( updatedPageModel, pageCmd ) =
--             Login.update model.session subMsg pageModel
--         cmd =
--             mapCommand GotLoginMsg pageCmd
--         updatedModel =
--             { model | pageModel = updatedPageModel }
--     in
--     case subMsg of
--         Login.LoginRequest data ->
--             let
--                 ( updatedSession, sessionCmd ) =
--                     Session.update (Login data) model.session
--                 mergedCmd =
--                     Cmd.batch [ cmd, mapCommand GotSessionMsg sessionCmd ]
--             in
--             ( { updatedModel | session = updatedSession }, mergedCmd )
--         _ ->
--             ( updatedModel, cmd )


mapCommand : (subMsg -> Msg) -> Cmd subMsg -> Cmd Msg
mapCommand toMsg subCmd =
    Cmd.map toMsg subCmd



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , onUrlChange = \url -> GotRouterMsg (ChangedUrl url)
        , onUrlRequest = \urlRequest -> GotRouterMsg (ClickedLink urlRequest)
        , subscriptions = subscriptions
        , update = update
        , view = view
        }

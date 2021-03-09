module Page.Login exposing (Model, Msg(..), init, update, view)

import Api exposing (Cred, Response)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import RemoteData exposing (RemoteData(..))
import Route
import Session exposing (Session(..))



-- MODEL


type alias Model =
    { error : Maybe Api.Error
    , form : Form
    }


type alias Form =
    { username : String
    , password : String
    }


init : ( Model, Cmd Msg )
init =
    ( { error = Nothing
      , form =
            { username = ""
            , password = ""
            }
      }
    , Cmd.none
    )



-- VIEW


view : Session -> Model -> { title : String, content : Html Msg }
view _ model =
    { title = "Logi"
    , content = main_ [] [ viewForm model.form ]
    }


viewForm : Form -> Html Msg
viewForm form =
    Html.form [ onSubmit SubmittedForm ]
        [ input
            [ required True
            , placeholder "Username"
            , onInput EnteredUsername
            , value form.username
            ]
            []
        , input
            [ required True
            , type_ "password"
            , placeholder "Password"
            , onInput EnteredPassword
            , value form.password
            ]
            []
        , button [] [ text "Sign in" ]
        ]



-- UPDATE


type Msg
    = SubmittedForm
    | EnteredUsername String
    | EnteredPassword String
    | LoginRequest (Response Cred)


update : Session -> Msg -> Model -> ( Model, Cmd Msg )
update session msg model =
    case msg of
        SubmittedForm ->
            ( { model | error = Nothing }
            , Api.login model.form.username model.form.password LoginRequest
            )

        EnteredUsername username ->
            updateForm (\form -> { form | username = username }) model

        EnteredPassword password ->
            updateForm (\form -> { form | password = password }) model

        LoginRequest NotAsked ->
            ( model, Cmd.none )

        LoginRequest Loading ->
            ( model, Cmd.none )

        LoginRequest (Failure error) ->
            ( { model | error = Just error }
            , Cmd.none
            )

        LoginRequest (Success _) ->
            ( model
            , Route.replaceUrl (Session.navKey session) Route.Home
            )


updateForm : (Form -> Form) -> Model -> ( Model, Cmd Msg )
updateForm transform model =
    ( { model | form = transform model.form }, Cmd.none )

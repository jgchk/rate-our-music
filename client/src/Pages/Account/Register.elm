module Pages.Account.Register exposing (Model, Msg, Params, page)

import Api
import Api.Mutation
import Api.Object
import Api.Object.Account
import Api.Object.AccountMutation
import Api.Object.Auth
import Browser.Navigation as Nav
import Element exposing (..)
import Element.Input as Input
import Graphql.SelectionSet as SelectionSet exposing (with)
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import String.Verify
import Utils.Route
import Verify exposing (Validator, validate, verify)


page : Page Params Model Msg
page =
    Page.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , save = save
        , load = load
        }



-- INIT


type alias Params =
    ()


type alias Model =
    { session : Api.Session
    , key : Nav.Key
    , form : Form
    , problems : List Problem
    }


type alias Form =
    { username : String
    , password : String
    , passwordConfirmation : String
    }


type Problem
    = ValidationProblem ValidatedField String
    | ServerProblem Api.Error


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared _ =
    ( { session = shared.session
      , key = shared.key
      , form =
            { username = ""
            , password = ""
            , passwordConfirmation = ""
            }
      , problems = []
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = EnteredUsername String
    | EnteredPassword String
    | SubmittedForm
    | RegisterRequest (Api.Response AccountMutation)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EnteredUsername username ->
            ( updateForm (\form -> { form | username = username }) model
            , Cmd.none
            )

        EnteredPassword password ->
            ( updateForm (\form -> { form | password = password }) model
            , Cmd.none
            )

        SubmittedForm ->
            case validator model.form of
                Ok validForm ->
                    ( { model | session = Api.LoggingIn }
                    , registerAccount { username = validForm.username, password = validForm.password } model.session
                    )

                Err ( firstProblem, otherProblems ) ->
                    ( { model | problems = firstProblem :: otherProblems }
                    , Cmd.none
                    )

        RegisterRequest response ->
            case response of
                Ok (AccountMutation auth) ->
                    ( { model | session = Api.LoggedIn auth }
                    , openAccountPage model.key auth.account.id
                    )

                Err errors ->
                    ( { model | session = Api.LoggedOut, problems = List.map ServerProblem errors }
                    , Cmd.none
                    )


updateForm : (Form -> Form) -> Model -> Model
updateForm transform model =
    { model | form = transform model.form }


save : Model -> Shared.Model -> Shared.Model
save model shared =
    { shared | session = model.session }


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load shared model =
    ( { model | session = shared.session, key = shared.key }
    , case shared.session of
        Api.LoggedIn auth ->
            openAccountPage shared.key auth.account.id

        _ ->
            Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    { title = "Register"
    , body =
        [ column []
            [ Input.username []
                { onChange = EnteredUsername
                , text = model.form.username
                , placeholder = Nothing
                , label = Input.labelLeft [] (text "Username")
                }
            , Input.newPassword []
                { onChange = EnteredPassword
                , text = model.form.password
                , placeholder = Nothing
                , label = Input.labelLeft [] (text "Password")
                , show = False
                }
            , Input.button []
                { onPress = Just SubmittedForm
                , label = text "Register"
                }
            ]
        ]
    }



-- FORM


type alias ValidatedForm =
    { username : String
    , password : String
    }


type ValidatedField
    = UsernameField
    | PasswordField


validator : Validator Problem Form ValidatedForm
validator =
    validate ValidatedForm
        |> verify .username (String.Verify.notBlank (ValidationProblem UsernameField "username is required"))
        |> verify .password (String.Verify.notBlank (ValidationProblem PasswordField "password is required"))



-- REQUESTS


type AccountMutation
    = AccountMutation Api.Auth


registerAccount : Api.Object.AccountMutation.RegisterRequiredArguments -> Api.Session -> Cmd Msg
registerAccount args =
    let
        rootSelection =
            SelectionSet.succeed AccountMutation
                |> with (Api.Object.AccountMutation.register args credSelection)

        credSelection =
            SelectionSet.succeed Api.Auth
                |> with Api.Object.Auth.token
                |> with Api.Object.Auth.exp
                |> with (Api.Object.Auth.account accountSelection)

        accountSelection =
            SelectionSet.succeed Api.Account
                |> with Api.Object.Account.id
                |> with Api.Object.Account.username
    in
    Api.sendMutation RegisterRequest (Api.Mutation.account rootSelection)



-- NAVIGATION


openAccountPage : Nav.Key -> Int -> Cmd msg
openAccountPage key id =
    Utils.Route.navigate key (Route.Account__Id_Int { id = id })

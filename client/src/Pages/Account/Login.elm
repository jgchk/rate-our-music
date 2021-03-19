module Pages.Account.Login exposing (Model, Msg, Params, page)

import Api
import Api.Mutation
import Api.Object
import Api.Object.Account
import Api.Object.AccountMutation
import Api.Object.Auth
import Browser.Navigation as Nav
import Element
import Element.Font
import Element.Input
import FeatherIcons
import Graphql.SelectionSet as SelectionSet exposing (with)
import List.Extra
import Maybe.Extra
import Shared
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import Utils.Route
import Utils.UI
import Zipper


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
    , problems :
        { invalidCredentials : Bool
        , other : List Api.Error
        }
    }


type alias Form =
    { username : String
    , password : String
    , showPassword : Bool
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared _ =
    ( { session = shared.session
      , key = shared.key
      , form =
            { username = ""
            , password = ""
            , showPassword = False
            }
      , problems =
            { invalidCredentials = False
            , other = []
            }
      }
    , case shared.session of
        Api.LoggedIn auth ->
            Utils.Route.openAccountPage shared.key auth.account.id

        _ ->
            Cmd.none
    )



-- UPDATE


type Msg
    = EnteredUsername String
    | EnteredPassword String
    | ShowPassword Bool
    | SubmittedForm
    | LoginRequest (Api.Response LoginMutation)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        updateForm : (Form -> Form) -> Model -> Model
        updateForm updateFn =
            Zipper.zip
                >> Zipper.into .form (\form model_ -> { model_ | form = form })
                >> Zipper.map updateFn
                >> Zipper.unzip
    in
    case msg of
        EnteredUsername username ->
            ( model |> updateForm (\form -> { form | username = username })
            , Cmd.none
            )

        EnteredPassword password ->
            ( model |> updateForm (\form -> { form | password = password })
            , Cmd.none
            )

        ShowPassword show ->
            ( model |> updateForm (\form -> { form | showPassword = show })
            , Cmd.none
            )

        SubmittedForm ->
            ( { model | session = Api.LoggingIn }
            , login { username = model.form.username, password = model.form.password } model.session
            )

        LoginRequest response ->
            case response of
                Ok (LoginMutation auth) ->
                    ( { model | session = Api.LoggedIn auth }
                    , Utils.Route.openAccountPage model.key auth.account.id
                    )

                Err errors ->
                    let
                        invalidCredentials =
                            Maybe.Extra.isJust <| List.Extra.find ((==) Api.InvalidCredentialsError) errors

                        otherErrors =
                            List.filter (\error -> error /= Api.InvalidCredentialsError) errors
                    in
                    ( { model
                        | session = Api.LoggedOut
                        , problems = { invalidCredentials = invalidCredentials, other = otherErrors }
                      }
                    , Cmd.none
                    )


save : Model -> Shared.Model -> Shared.Model
save model shared =
    { shared | session = model.session }


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load shared model =
    ( { model | session = shared.session, key = shared.key }
    , case shared.session of
        Api.LoggedIn auth ->
            Utils.Route.openAccountPage shared.key auth.account.id

        _ ->
            Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    { title = "Login"
    , body =
        [ Element.column []
            [ if model.problems.invalidCredentials then
                Element.el [ Element.Font.color (Element.rgb 1 0 0) ] (Element.text "Invalid credentials")

              else
                Element.none
            , Element.Input.username []
                { onChange = EnteredUsername
                , text = model.form.username
                , placeholder = Nothing
                , label = Element.Input.labelLeft [] (Element.text "Username")
                }
            , Element.Input.currentPassword
                [ Element.inFront
                    (Element.Input.button [ Element.alignRight, Element.centerY, Element.padding (Utils.UI.spacing 3) ]
                        { onPress = Just (ShowPassword (not model.form.showPassword))
                        , label =
                            Utils.UI.icon <|
                                if model.form.showPassword then
                                    FeatherIcons.eyeOff

                                else
                                    FeatherIcons.eye
                        }
                    )
                , Utils.UI.onEnter SubmittedForm
                ]
                { onChange = EnteredPassword
                , text = model.form.password
                , placeholder = Nothing
                , label = Element.Input.labelLeft [] (Element.text "Password")
                , show = model.form.showPassword
                }
            , Element.Input.button []
                { onPress = Just SubmittedForm
                , label = Element.text "Login"
                }
            ]
        ]
    }



-- REQUESTS


type LoginMutation
    = LoginMutation Api.Auth


login : Api.Object.AccountMutation.LoginRequiredArguments -> Api.Session -> Cmd Msg
login args =
    let
        rootSelection =
            SelectionSet.succeed LoginMutation
                |> with (Api.Object.AccountMutation.login args credSelection)

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
    Api.sendMutation LoginRequest (Api.Mutation.account rootSelection)

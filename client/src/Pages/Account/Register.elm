module Pages.Account.Register exposing (Model, Msg, Params, page)

import Api
import Api.Mutation
import Api.Object
import Api.Object.Account
import Api.Object.AccountMutation
import Api.Object.AccountQuery
import Api.Object.Auth
import Api.Query
import Browser.Navigation as Nav
import Element exposing (..)
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import FeatherIcons
import Graphql.SelectionSet as SelectionSet exposing (with)
import RemoteData exposing (RemoteData)
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import String.Verify
import Utils.Debounce
import Utils.Route
import Utils.UI as UI
import Verify


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
    , doesUsernameExistRequest : RemoteData Api.Error Bool
    , password : String
    , showPassword : Bool
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
            , doesUsernameExistRequest = RemoteData.NotAsked
            , password = ""
            , showPassword = False
            }
      , problems = []
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = EnteredUsername String
    | TimePassed String
    | DoesUsernameExistRequest (Api.Response DoesUsernameExistQuery)
    | EnteredPassword String
    | ShowPassword Bool
    | SubmittedForm
    | RegisterRequest (Api.Response RegisterMutation)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EnteredUsername username ->
            ( updateForm (\form -> { form | username = username, doesUsernameExistRequest = RemoteData.Loading }) model
            , Utils.Debounce.queue 500 (TimePassed username)
            )

        TimePassed debouncedUsername ->
            if debouncedUsername == model.form.username then
                ( model
                , checkIfUsernameExists { username = debouncedUsername } model.session
                )

            else
                ( model, Cmd.none )

        DoesUsernameExistRequest response ->
            case response of
                Ok (DoesUsernameExistQuery exists) ->
                    ( updateForm (\form -> { form | doesUsernameExistRequest = RemoteData.Success exists }) model
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        EnteredPassword password ->
            ( updateForm (\form -> { form | password = password }) model
            , Cmd.none
            )

        ShowPassword show ->
            ( updateForm (\form -> { form | showPassword = show }) model
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
                Ok (RegisterMutation auth) ->
                    ( { model | session = Api.LoggedIn auth }
                    , openAccountPage model.key auth.account.id
                    )

                Err errors ->
                    let
                        problems =
                            List.map
                                (\error ->
                                    case error of
                                        Api.DuplicateUsernameError ->
                                            ValidationProblem UsernameField "username already exists"

                                        Api.InvalidPasswordLength ->
                                            ValidationProblem PasswordField "password must be 1 to 64 characters"

                                        _ ->
                                            ServerProblem error
                                )
                                errors
                    in
                    ( { model | session = Api.LoggedOut, problems = problems }
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
    let
        findErrors : ValidatedField -> List String
        findErrors validatedField =
            List.filterMap
                (\problem ->
                    case problem of
                        ValidationProblem field error ->
                            if field == validatedField then
                                Just error

                            else
                                Nothing

                        _ ->
                            Nothing
                )
                model.problems

        usernameErrors =
            findErrors UsernameField

        passwordErrors =
            findErrors PasswordField

        borderAttrs errors =
            if List.isEmpty errors then
                []

            else
                [ Border.color (rgb 1 0 0) ]

        errorMessages errors =
            if List.isEmpty errors then
                []

            else
                List.map (\error -> el [ Font.color (rgb 1 0 0) ] (text error)) errors
    in
    { title = "Register"
    , body =
        [ column []
            [ column []
                (Input.username
                    (borderAttrs usernameErrors
                        ++ (case model.form.doesUsernameExistRequest of
                                RemoteData.NotAsked ->
                                    []

                                RemoteData.Loading ->
                                    [ inFront (el [ alignRight, centerY, padding (UI.spacing 3) ] (FeatherIcons.loader |> FeatherIcons.toHtml [] |> html)) ]

                                RemoteData.Success exists ->
                                    if exists then
                                        [ inFront (el [ alignRight, centerY, padding (UI.spacing 3), Font.color (rgb 1 0 0) ] (FeatherIcons.x |> FeatherIcons.toHtml [] |> html))
                                        , Border.color (rgb 1 0 0)
                                        ]

                                    else
                                        [ inFront (el [ alignRight, centerY, padding (UI.spacing 3), Font.color (rgb 0 1 0) ] (FeatherIcons.check |> FeatherIcons.toHtml [] |> html))
                                        , Border.color (rgb 0 1 0)
                                        ]

                                RemoteData.Failure _ ->
                                    []
                           )
                    )
                    { onChange = EnteredUsername
                    , text = model.form.username
                    , placeholder = Nothing
                    , label = Input.labelLeft [] (text "Username")
                    }
                    :: errorMessages usernameErrors
                )
            , column []
                (Input.newPassword
                    (borderAttrs passwordErrors
                        ++ [ inFront
                                (Input.button [ alignRight, centerY, padding (UI.spacing 3) ]
                                    { onPress = Just (ShowPassword (not model.form.showPassword))
                                    , label =
                                        (if model.form.showPassword then
                                            FeatherIcons.eyeOff

                                         else
                                            FeatherIcons.eye
                                        )
                                            |> FeatherIcons.toHtml []
                                            |> html
                                    }
                                )
                           ]
                    )
                    { onChange = EnteredPassword
                    , text = model.form.password
                    , placeholder = Nothing
                    , label = Input.labelLeft [] (text "Password")
                    , show = model.form.showPassword
                    }
                    :: errorMessages passwordErrors
                )
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


validator : Verify.Validator Problem Form ValidatedForm
validator =
    Verify.validate ValidatedForm
        |> Verify.custom validateUsername
        |> Verify.verify .password (String.Verify.notBlank (ValidationProblem PasswordField "password is required"))


validateUsername : Verify.Validator Problem Form String
validateUsername =
    let
        doesntExist form =
            case form.doesUsernameExistRequest of
                RemoteData.Success True ->
                    Err ( ValidationProblem UsernameField "username already exists", [] )

                _ ->
                    Ok form
    in
    doesntExist
        >> Result.andThen
            (\form -> String.Verify.notBlank (ValidationProblem UsernameField "username is required") form.username)



-- REQUESTS


type DoesUsernameExistQuery
    = DoesUsernameExistQuery Bool


checkIfUsernameExists : Api.Object.AccountQuery.DoesUsernameExistRequiredArguments -> Api.Session -> Cmd Msg
checkIfUsernameExists args =
    let
        rootSelection =
            SelectionSet.succeed DoesUsernameExistQuery
                |> with (Api.Object.AccountQuery.doesUsernameExist args)
    in
    Api.sendQuery DoesUsernameExistRequest (Api.Query.account rootSelection)


type RegisterMutation
    = RegisterMutation Api.Auth


registerAccount : Api.Object.AccountMutation.RegisterRequiredArguments -> Api.Session -> Cmd Msg
registerAccount args =
    let
        rootSelection =
            SelectionSet.succeed RegisterMutation
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

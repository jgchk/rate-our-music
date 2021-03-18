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
import List.Extra
import Maybe.Extra
import RemoteData exposing (RemoteData)
import Shared
import Simple.Animation
import Simple.Animation.Property
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import Utils.Debounce
import Utils.Route
import Utils.UI as UI
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
        { validation : ValidationErrors
        , other : List Api.Error
        }
    }


type alias Form =
    { username : String
    , doesUsernameExistRequest : RemoteData Api.Error Bool
    , password : String
    , showPassword : Bool
    }


type alias ValidationErrors =
    { username :
        { invalidLength : Bool
        , alreadyExists : Bool
        }
    , password :
        { invalidLength : Bool
        }
    }


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
      , problems =
            { validation =
                { username =
                    { invalidLength = False
                    , alreadyExists = False
                    }
                , password =
                    { invalidLength = False
                    }
                }
            , other = []
            }
      }
    , case shared.session of
        Api.LoggedIn auth ->
            openAccountPage shared.key auth.account.id

        _ ->
            Cmd.none
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
    let
        updateForm : (Form -> Form) -> Model -> Model
        updateForm updateFn =
            Zipper.zip
                >> Zipper.into .form (\form model_ -> { model_ | form = form })
                >> Zipper.map updateFn
                >> Zipper.unzip

        updateProblems : Model -> Model
        updateProblems =
            Zipper.zip
                >> Zipper.map
                    (\model_ ->
                        { model_
                            | problems =
                                { validation = validator True model_.form
                                , other = []
                                }
                        }
                    )
                >> Zipper.unzip
    in
    case msg of
        EnteredUsername username ->
            let
                shouldMakeUsernameExistsRequest model_ =
                    String.length model_.form.username > 0 && not model_.problems.validation.username.invalidLength

                updatedModel =
                    model
                        |> updateForm (\form -> { form | username = username })
                        |> updateProblems
                        |> (\model_ ->
                                updateForm
                                    (\form ->
                                        { form
                                            | doesUsernameExistRequest =
                                                if shouldMakeUsernameExistsRequest model_ then
                                                    RemoteData.Loading

                                                else
                                                    RemoteData.NotAsked
                                        }
                                    )
                                    model_
                           )
            in
            ( updatedModel
            , if shouldMakeUsernameExistsRequest updatedModel then
                Utils.Debounce.queue 500 (TimePassed username)

              else
                Cmd.none
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
                    ( model
                        |> updateForm (\form -> { form | doesUsernameExistRequest = RemoteData.Success exists })
                        |> updateProblems
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        EnteredPassword password ->
            ( model
                |> updateForm (\form -> { form | password = password })
                |> updateProblems
            , Cmd.none
            )

        ShowPassword show ->
            ( model |> updateForm (\form -> { form | showPassword = show })
            , Cmd.none
            )

        SubmittedForm ->
            let
                validationErrors =
                    validator False model.form
            in
            if isValid validationErrors then
                ( { model | session = Api.LoggingIn }
                , registerAccount { username = model.form.username, password = model.form.password } model.session
                )

            else
                ( { model
                    | problems =
                        { validation = validationErrors
                        , other = []
                        }
                  }
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
                        usernameInvalidLength =
                            Maybe.Extra.isJust <| List.Extra.find ((==) Api.UsernameLengthError) errors

                        usernameAlreadyExists =
                            Maybe.Extra.isJust <| List.Extra.find ((==) Api.DuplicateUsernameError) errors

                        passwordInvalidLength =
                            Maybe.Extra.isJust <| List.Extra.find ((==) Api.PasswordLengthError) errors

                        otherErrors =
                            List.filter
                                (\error ->
                                    error
                                        /= Api.UsernameLengthError
                                        && error
                                        /= Api.DuplicateUsernameError
                                        && error
                                        /= Api.PasswordLengthError
                                )
                                errors

                        problems =
                            { validation =
                                { username =
                                    { invalidLength = usernameInvalidLength
                                    , alreadyExists = usernameAlreadyExists
                                    }
                                , password =
                                    { invalidLength = passwordInvalidLength
                                    }
                                }
                            , other = otherErrors
                            }
                    in
                    ( { model | session = Api.LoggedOut, problems = problems }
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
        validationProblems =
            formatValidationErrors model.problems.validation

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
                    (borderAttrs validationProblems.username
                        ++ (if String.length model.form.username > 0 then
                                case model.form.doesUsernameExistRequest of
                                    RemoteData.NotAsked ->
                                        []

                                    RemoteData.Loading ->
                                        [ inFront
                                            (UI.animated el
                                                (Simple.Animation.fromTo
                                                    { duration = 1200
                                                    , options = [ Simple.Animation.loop, Simple.Animation.linear ]
                                                    }
                                                    [ Simple.Animation.Property.rotate 0 ]
                                                    [ Simple.Animation.Property.rotate 360 ]
                                                )
                                                [ alignRight, centerY, padding (UI.spacing 3) ]
                                                (UI.icon <| FeatherIcons.loader)
                                            )
                                        ]

                                    RemoteData.Success exists ->
                                        if exists then
                                            [ inFront (el [ alignRight, centerY, padding (UI.spacing 3), Font.color (rgb 1 0 0) ] (UI.icon <| FeatherIcons.x))
                                            , Border.color (rgb 1 0 0)
                                            ]

                                        else
                                            [ inFront (el [ alignRight, centerY, padding (UI.spacing 3), Font.color (rgb 0 1 0) ] (UI.icon <| FeatherIcons.check))
                                            , Border.color (rgb 0 1 0)
                                            ]

                                    RemoteData.Failure _ ->
                                        []

                            else
                                []
                           )
                    )
                    { onChange = EnteredUsername
                    , text = model.form.username
                    , placeholder = Nothing
                    , label = Input.labelLeft [] (text "Username")
                    }
                    :: errorMessages validationProblems.username
                )
            , column []
                (Input.newPassword
                    (borderAttrs validationProblems.password
                        ++ [ inFront
                                (Input.button [ alignRight, centerY, padding (UI.spacing 3) ]
                                    { onPress = Just (ShowPassword (not model.form.showPassword))
                                    , label =
                                        UI.icon <|
                                            if model.form.showPassword then
                                                FeatherIcons.eyeOff

                                            else
                                                FeatherIcons.eye
                                    }
                                )
                           , UI.onEnter SubmittedForm
                           ]
                    )
                    { onChange = EnteredPassword
                    , text = model.form.password
                    , placeholder = Nothing
                    , label = Input.labelLeft [] (text "Password")
                    , show = model.form.showPassword
                    }
                    :: errorMessages validationProblems.password
                )
            , Input.button []
                { onPress = Just SubmittedForm
                , label = text "Register"
                }
            ]
        ]
    }



-- FORM


validator : Bool -> Form -> ValidationErrors
validator isLive form =
    let
        usernameTooShort =
            not isLive && String.length form.username < 1

        usernameTooLong =
            String.length form.username > 64

        usernameAlreadyExists =
            form.doesUsernameExistRequest == RemoteData.Success True

        passwordTooShort =
            not isLive && String.length form.password < 1

        passwordTooLong =
            String.length form.password > 64
    in
    { username =
        { invalidLength = usernameTooShort || usernameTooLong
        , alreadyExists = usernameAlreadyExists
        }
    , password =
        { invalidLength = passwordTooShort || passwordTooLong
        }
    }


isValid : ValidationErrors -> Bool
isValid errors =
    not
        (errors.username.invalidLength
            || errors.username.alreadyExists
            || errors.password.invalidLength
        )


formatValidationErrors : ValidationErrors -> { username : List String, password : List String }
formatValidationErrors errors =
    let
        usernameErrors =
            []
                ++ (if errors.username.invalidLength then
                        [ "must be between 1 and 64 characters" ]

                    else
                        []
                   )
                ++ (if errors.username.alreadyExists then
                        [ "username already exists" ]

                    else
                        []
                   )

        passwordErrors =
            []
                ++ (if errors.password.invalidLength then
                        [ "must be between 1 and 64 characters" ]

                    else
                        []
                   )
    in
    { username = usernameErrors
    , password = passwordErrors
    }



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

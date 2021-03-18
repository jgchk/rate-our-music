module Pages.Release.Submit exposing (Model, Msg, Params, page)

import Api
import Api.Enum.ReleaseType exposing (ReleaseType(..))
import Api.InputObject
import Api.Mutation
import Api.Object exposing (ArtistQuery, Release)
import Api.Object.Artist
import Api.Object.ArtistQuery
import Api.Object.Release as ObjRelease
import Api.Object.ReleaseMutation as ObjReleaseMutation
import Api.Query
import Browser.Navigation as Nav
import Element exposing (..)
import Element.Border
import Element.Font
import Element.Input as Input
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet as SelectionSet exposing (with)
import List.Extra
import Maybe.Verify
import Process
import SearchBox
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import String.Verify
import Task
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
    , problems : List ValidationProblem
    }


type alias Form =
    { title : String
    , maybeReleaseType : Maybe ReleaseType
    , releaseTypeText : String
    , releaseTypeSearchBox : SearchBox.State
    , artistEntries : List ArtistEntry
    }


type alias ArtistEntry =
    { artists : Maybe (List Artist)
    , maybeArtist : Maybe Artist
    , artistText : String
    , artistSearchBox : SearchBox.State
    }


type alias Artist =
    { id : Int
    , name : String
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared _ =
    ( { session = shared.session
      , key = shared.key
      , form =
            { title = ""
            , maybeReleaseType = Nothing
            , releaseTypeText = ""
            , releaseTypeSearchBox = SearchBox.init
            , artistEntries =
                [ { artists = Nothing
                  , maybeArtist = Nothing
                  , artistText = ""
                  , artistSearchBox = SearchBox.init
                  }
                ]
            }
      , problems = []
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = EnteredTitle String
    | ChangedReleaseType (SearchBox.ChangeEvent ReleaseType)
    | ChangedArtist Int (SearchBox.ChangeEvent Artist)
    | TimePassed Int String
    | GetArtistsRequest Int (Api.Response ArtistQuery)
    | AddArtist
    | RemoveArtist Int
    | SubmittedForm
    | CreateReleaseRequest (Api.Response ReleaseMutation)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EnteredTitle title ->
            ( updateForm (\form -> { form | title = title }) model, Cmd.none )

        ChangedReleaseType changeEvent ->
            case changeEvent of
                SearchBox.SelectionChanged releaseType ->
                    ( updateForm (\form -> { form | maybeReleaseType = Just releaseType }) model, Cmd.none )

                SearchBox.TextChanged releaseTypeText ->
                    ( updateForm
                        (\form ->
                            { form
                                | maybeReleaseType = Nothing
                                , releaseTypeText = releaseTypeText
                                , releaseTypeSearchBox = SearchBox.reset form.releaseTypeSearchBox
                            }
                        )
                        model
                    , Cmd.none
                    )

                SearchBox.SearchBoxChanged subMsg ->
                    ( updateForm (\form -> { form | releaseTypeSearchBox = SearchBox.update subMsg model.form.releaseTypeSearchBox }) model
                    , Cmd.none
                    )

        ChangedArtist i changeEvent ->
            case changeEvent of
                SearchBox.SelectionChanged artist ->
                    ( updateForm (updateArtistEntry i (\entry -> { entry | maybeArtist = Just artist })) model, Cmd.none )

                SearchBox.TextChanged artistText ->
                    ( updateForm
                        (updateArtistEntry i
                            (\entry ->
                                { entry
                                    | artists = Nothing
                                    , maybeArtist = Nothing
                                    , artistText = artistText
                                    , artistSearchBox = SearchBox.reset entry.artistSearchBox
                                }
                            )
                        )
                        model
                    , enqueueDebounceFor i artistText
                    )

                SearchBox.SearchBoxChanged subMsg ->
                    ( updateForm (updateArtistEntry i (\entry -> { entry | artistSearchBox = SearchBox.update subMsg entry.artistSearchBox })) model, Cmd.none )

        TimePassed i debouncedString ->
            if Just debouncedString == Maybe.map .artistText (List.Extra.getAt i model.form.artistEntries) then
                ( updateForm (updateArtistEntry i (\entry -> { entry | artistSearchBox = SearchBox.setLoading entry.artistSearchBox })) model
                , getArtists i { name = debouncedString } model.session
                )

            else
                ( model, Cmd.none )

        GetArtistsRequest i response ->
            case response of
                Ok (ArtistQuery artist) ->
                    ( updateForm (updateArtistEntry i (\entry -> { entry | artists = Just artist })) model, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        AddArtist ->
            ( updateForm
                (\form ->
                    { form
                        | artistEntries =
                            form.artistEntries
                                ++ [ { artists = Nothing
                                     , maybeArtist = Nothing
                                     , artistText = ""
                                     , artistSearchBox = SearchBox.init
                                     }
                                   ]
                    }
                )
                model
            , Cmd.none
            )

        RemoveArtist i ->
            ( updateForm (\form -> { form | artistEntries = List.Extra.removeAt i form.artistEntries }) model, Cmd.none )

        SubmittedForm ->
            case validator model.form of
                Ok validForm ->
                    ( model
                    , createRelease
                        { title = validForm.title
                        , releaseType = validForm.releaseType
                        , artists = validForm.artists
                        }
                        model.session
                    )

                Err ( firstProblem, otherProblems ) ->
                    ( { model | problems = firstProblem :: otherProblems }, Cmd.none )

        CreateReleaseRequest response ->
            case response of
                Ok (ReleaseMutation (Release id)) ->
                    ( model, Utils.Route.navigate model.key (Route.Release__Id_Int { id = id }) )

                Err _ ->
                    ( model, Cmd.none )


updateForm : (Form -> Form) -> Model -> Model
updateForm transform model =
    { model | form = transform model.form }


updateArtistEntry : Int -> (ArtistEntry -> ArtistEntry) -> Form -> Form
updateArtistEntry i transform form =
    { form | artistEntries = List.Extra.updateAt i transform form.artistEntries }


save : Model -> Shared.Model -> Shared.Model
save _ shared =
    shared


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load shared model =
    ( { model | session = shared.session }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    let
        findError validatedField =
            List.Extra.findMap
                (\(ValidationProblem field error) ->
                    if field == validatedField then
                        Just error

                    else
                        Nothing
                )
                model.problems

        titleError =
            findError TitleField

        releaseTypeError =
            findError ReleaseTypeField

        artistError i =
            findError (ArtistField i)

        borderAttrs maybeError =
            case maybeError of
                Just _ ->
                    [ Element.Border.color (rgb 1 0 0) ]

                Nothing ->
                    []

        validationMessage maybeError =
            case maybeError of
                Just error ->
                    [ el [ Element.Font.color (rgb 1 0 0) ] (text error) ]

                Nothing ->
                    []

        removeArtistButton i =
            if i == 0 then
                []

            else
                [ Input.button [ width (px 20) ]
                    { onPress = Just (RemoveArtist i)
                    , label = el [ centerX ] (text "-")
                    }
                ]
    in
    { title = "Id_Int"
    , body =
        [ column []
            [ column []
                (Input.text (borderAttrs titleError)
                    { onChange = EnteredTitle
                    , text = model.form.title
                    , placeholder = Nothing
                    , label = Input.labelLeft [] (text "Title")
                    }
                    :: validationMessage titleError
                )
            , column []
                (SearchBox.input (borderAttrs releaseTypeError)
                    { onChange = ChangedReleaseType
                    , text = model.form.releaseTypeText
                    , selected = model.form.maybeReleaseType
                    , options = Just [ Album, Ep, Single, Mixtape, Compilation, DjMix, Bootleg, Video ]
                    , label = Input.labelLeft [] (text "Type")
                    , placeholder = Nothing
                    , toLabel = releaseTypeToString
                    , filter = \query releaseType -> String.startsWith (String.toLower query) (String.toLower (releaseTypeToString releaseType))
                    , state = model.form.releaseTypeSearchBox
                    }
                    :: validationMessage releaseTypeError
                )
            , row []
                (List.indexedMap
                    (\i entry ->
                        row []
                            (SearchBox.input (borderAttrs (artistError i) ++ [ width (px 200) ])
                                { onChange = ChangedArtist i
                                , text = entry.artistText
                                , selected = entry.maybeArtist
                                , options = entry.artists
                                , label = Input.labelLeft [] (text "Artist")
                                , placeholder = Nothing
                                , toLabel = \artist -> artist.name
                                , filter = \_ _ -> True
                                , state = entry.artistSearchBox
                                }
                                :: removeArtistButton i
                            )
                    )
                    model.form.artistEntries
                    ++ [ Input.button [ width (px 20) ] { onPress = Just AddArtist, label = el [ centerX ] (text "+") } ]
                )
            , Input.button []
                { onPress = Just SubmittedForm
                , label = text "Submit"
                }
            ]
        ]
    }


releaseTypeToString : ReleaseType -> String
releaseTypeToString releaseType =
    case releaseType of
        Album ->
            "Album"

        Compilation ->
            "Compilation"

        Ep ->
            "EP"

        Single ->
            "Single"

        Mixtape ->
            "Mixtape"

        DjMix ->
            "DJ Mix"

        Bootleg ->
            "Bootleg"

        Video ->
            "Video"


enqueueDebounceFor : Int -> String -> Cmd Msg
enqueueDebounceFor index string =
    if String.isEmpty string then
        Cmd.none

    else
        Process.sleep 500
            |> Task.perform (always (TimePassed index string))



-- FORM


type alias ValidatedForm =
    { title : String
    , releaseType : ReleaseType
    , artists : List Api.InputObject.ArtistInput
    }


type ValidationProblem
    = ValidationProblem ValidatedField String


type ValidatedField
    = TitleField
    | ReleaseTypeField
    | ArtistsField
    | ArtistField Int


validator : Validator ValidationProblem Form ValidatedForm
validator =
    validate ValidatedForm
        |> verify .title (String.Verify.notBlank (ValidationProblem TitleField "title is required"))
        |> verify .maybeReleaseType (Maybe.Verify.isJust (ValidationProblem ReleaseTypeField "release type is required"))
        |> verify .artistEntries artistsValidator


artistsValidator : Validator ValidationProblem (List ArtistEntry) (List Api.InputObject.ArtistInput)
artistsValidator input =
    let
        results =
            List.indexedMap artistValidator input

        problems =
            List.filterMap
                (\result ->
                    case result of
                        Ok _ ->
                            Nothing

                        Err problem ->
                            Just problem
                )
                results
    in
    case List.head problems of
        Just firstProblem ->
            Err ( firstProblem, Maybe.withDefault [] (List.tail problems) )

        Nothing ->
            let
                outputs =
                    List.filterMap
                        (\result ->
                            case result of
                                Ok output ->
                                    Just output

                                Err _ ->
                                    Nothing
                        )
                        results
            in
            if List.isEmpty outputs then
                Err ( ValidationProblem ArtistsField "at least one artist is required", [] )

            else
                let
                    duplicateIndexProblems =
                        List.indexedMap Tuple.pair outputs
                            |> List.filter
                                (\( _, output ) ->
                                    case output.id of
                                        Present _ ->
                                            True

                                        _ ->
                                            False
                                )
                            |> List.Extra.gatherEqualsBy
                                (\( _, output ) ->
                                    case output.id of
                                        Present id ->
                                            String.fromInt id

                                        _ ->
                                            ""
                                )
                            |> List.concatMap (\( _, dupes ) -> List.map (\( i, _ ) -> i) dupes)
                            |> List.map (\i -> ValidationProblem (ArtistField i) "artists must be unique")
                in
                case List.head duplicateIndexProblems of
                    Just firstProblem ->
                        Err ( firstProblem, Maybe.withDefault [] (List.tail duplicateIndexProblems) )

                    Nothing ->
                        Ok outputs


artistValidator : Int -> ArtistEntry -> Result ValidationProblem Api.InputObject.ArtistInput
artistValidator i input =
    case input.maybeArtist of
        Just artist ->
            Ok { id = Present artist.id, name = Absent }

        Nothing ->
            if String.isEmpty input.artistText then
                Err (ValidationProblem (ArtistField i) "artist is required")

            else
                Ok { id = Absent, name = Present input.artistText }



-- REQUESTS


type ReleaseMutation
    = ReleaseMutation Release


type Release
    = Release Int


createRelease : ObjReleaseMutation.CreateRequiredArguments -> Api.Session -> Cmd Msg
createRelease args =
    let
        rootSelection =
            SelectionSet.succeed ReleaseMutation
                |> with (ObjReleaseMutation.create args releaseSelection)

        releaseSelection =
            SelectionSet.succeed Release
                |> with ObjRelease.id
    in
    Api.sendMutation CreateReleaseRequest (Api.Mutation.release rootSelection)


type ArtistQuery
    = ArtistQuery (List Artist)


getArtists : Int -> Api.Object.ArtistQuery.FilterByNameRequiredArguments -> Api.Session -> Cmd Msg
getArtists index args =
    let
        rootSelection =
            SelectionSet.succeed ArtistQuery
                |> with (Api.Object.ArtistQuery.filterByName args artistSelection)

        artistSelection =
            SelectionSet.succeed Artist
                |> with Api.Object.Artist.id
                |> with Api.Object.Artist.name
    in
    Api.sendQuery (GetArtistsRequest index) (Api.Query.artist rootSelection)

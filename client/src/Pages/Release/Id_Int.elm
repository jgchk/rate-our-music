module Pages.Release.Id_Int exposing (Model, Msg, Params, page)

import Api
import Api.Enum.GenreVoteType
import Api.Enum.ReleaseType exposing (ReleaseType)
import Api.Object
import Api.Object.Artist as ObjArtist
import Api.Object.Genre as ObjGenre
import Api.Object.Release as ObjRelease
import Api.Object.ReleaseDate as ObjReleaseDate
import Api.Object.ReleaseQuery
import Api.Object.Track as ObjTrack
import Api.Query
import Element exposing (..)
import Element.Background as Background
import Element.Font as Font
import Graphql.SelectionSet as SelectionSet exposing (with)
import List
import List.Extra
import RemoteData exposing (RemoteData)
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import Utils.Font exposing (scaled)


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
    { id : Int }


type alias Model =
    { id : Int
    , releaseRequest : RemoteData (List Api.Error) Release
    }


type alias Release =
    { title : String
    , artists : List Artist
    , releaseDate : Maybe ReleaseDate
    , releaseType : ReleaseType
    , primaryGenres : List Genre
    , secondaryGenres : List Genre
    , tracks : List Track
    }


type alias Artist =
    { id : Int
    , name : String
    }


type alias ReleaseDate =
    { year : Int
    , month : Maybe Int
    , day : Maybe Int
    }


type alias Genre =
    { name : String }


type alias Track =
    { title : String
    , num : Int
    , durationMs : Maybe Int
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared { params } =
    ( { id = params.id
      , releaseRequest = RemoteData.NotAsked
      }
    , getRelease { id = params.id } shared.session
    )



-- UPDATE


type Msg
    = ReleaseRequest (Api.Response ReleaseQuery)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReleaseRequest response ->
            case response of
                Ok (ReleaseQuery release) ->
                    ( { model | releaseRequest = RemoteData.Success release }, Cmd.none )

                Err errors ->
                    ( { model | releaseRequest = RemoteData.Failure errors }, Cmd.none )


save : Model -> Shared.Model -> Shared.Model
save _ shared =
    shared


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load shared model =
    ( { model | releaseRequest = RemoteData.Loading }, getRelease { id = model.id } shared.session )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    { title = "Id_Int"
    , body =
        case model.releaseRequest of
            RemoteData.NotAsked ->
                []

            RemoteData.Loading ->
                [ text "Loading..." ]

            RemoteData.Failure _ ->
                [ text "Error" ]

            RemoteData.Success release ->
                [ row
                    [ Background.color (rgb 0.9 0.9 0.9)
                    , width (fill |> maximum 1600)
                    , centerX
                    , Font.size (scaled 1)
                    ]
                    [ column [ width (fillPortion 2) ]
                        [ el [ Font.size (scaled 3) ] <| text release.title
                        , row [ Font.size (scaled 2) ]
                            (List.map
                                (\artist ->
                                    [ link []
                                        { url = Route.toString (Route.Artist__Id_Int { id = artist.id })
                                        , label = text artist.name
                                        }
                                    , text ", "
                                    ]
                                )
                                release.artists
                                |> List.concat
                                |> List.Extra.init
                                |> Maybe.withDefault []
                            )
                        , text (Maybe.map dateToString release.releaseDate |> Maybe.withDefault "")
                        , text (releaseTypeToString release.releaseType)
                        , row [] <| List.map (\genre -> text genre.name) release.primaryGenres
                        , row [] <| List.map (\genre -> text genre.name) release.secondaryGenres
                        ]
                    , column [ width (fillPortion 1 |> maximum 500) ]
                        [ el
                            [ width fill
                            , height (px 500)
                            , Background.uncropped "https://e.snmc.io/i/fullres/w/8e7a772daaac6c22ca8c6addec3cadad/8813734"
                            ]
                            none
                        , column [] <|
                            List.map
                                (\track ->
                                    row []
                                        [ text (String.fromInt track.num)
                                        , text track.title
                                        , text (Maybe.withDefault "" (Maybe.map String.fromInt track.durationMs))
                                        ]
                                )
                                release.tracks
                        ]
                    ]
                ]
    }



-- REQUESTS


type ReleaseQuery
    = ReleaseQuery Release


getRelease : Api.Object.ReleaseQuery.GetOneRequiredArguments -> Api.Session -> Cmd Msg
getRelease args =
    let
        selection =
            SelectionSet.succeed ReleaseQuery
                |> with (Api.Object.ReleaseQuery.getOne args releaseSelection)

        releaseSelection =
            SelectionSet.succeed Release
                |> with ObjRelease.title
                |> with (ObjRelease.artists artistSelection)
                |> with (ObjRelease.releaseDate releaseDateSelection)
                |> with ObjRelease.releaseType
                |> with (ObjRelease.genres { voteType = Api.Enum.GenreVoteType.Primary } genreSelection)
                |> with (ObjRelease.genres { voteType = Api.Enum.GenreVoteType.Secondary } genreSelection)
                |> with (ObjRelease.tracks trackSelection)

        artistSelection =
            SelectionSet.succeed Artist
                |> with ObjArtist.id
                |> with ObjArtist.name

        releaseDateSelection =
            SelectionSet.succeed ReleaseDate
                |> with ObjReleaseDate.year
                |> with ObjReleaseDate.month
                |> with ObjReleaseDate.day

        genreSelection =
            SelectionSet.succeed Genre
                |> with ObjGenre.name

        trackSelection =
            SelectionSet.succeed Track
                |> with ObjTrack.title
                |> with ObjTrack.num
                |> with ObjTrack.durationMs
    in
    Api.sendQuery ReleaseRequest (Api.Query.release selection)



-- UTILS


monthToString : Int -> String
monthToString month =
    case month of
        1 ->
            "Jan"

        2 ->
            "Feb"

        3 ->
            "Mar"

        4 ->
            "Apr"

        5 ->
            "May"

        6 ->
            "Jun"

        7 ->
            "Jul"

        8 ->
            "Aug"

        9 ->
            "Sep"

        10 ->
            "Oct"

        11 ->
            "Nov"

        12 ->
            "Dec"

        _ ->
            "Unknown"


dateToString : ReleaseDate -> String
dateToString date =
    let
        day =
            Maybe.withDefault "" (Maybe.map (\day_ -> String.fromInt day_ ++ " ") date.day)

        month =
            Maybe.withDefault "" (Maybe.map (\month_ -> monthToString month_ ++ " ") date.month)

        year =
            String.fromInt date.year
    in
    day ++ month ++ year


releaseTypeToString : ReleaseType -> String
releaseTypeToString releaseType =
    case releaseType of
        Api.Enum.ReleaseType.Album ->
            "Album"

        Api.Enum.ReleaseType.Compilation ->
            "Compilation"

        Api.Enum.ReleaseType.Ep ->
            "EP"

        Api.Enum.ReleaseType.Single ->
            "Single"

        Api.Enum.ReleaseType.Mixtape ->
            "Mixtape"

        Api.Enum.ReleaseType.DjMix ->
            "DJ Mix"

        Api.Enum.ReleaseType.Bootleg ->
            "Bootleg"

        Api.Enum.ReleaseType.Video ->
            "Video"

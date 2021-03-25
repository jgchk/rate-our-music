module Api exposing (Account, Auth, Error(..), Response, ResponseToMsg, Session(..), auth, encodeError, mutationRequest, queryRequest, sendMutation, sendQuery, sendTask, withSession)

import Graphql.Http
import Graphql.Http.GraphqlError
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode
import Json.Encode
import Task



-- SESSION


type Session
    = LoggedOut
    | LoggingIn
    | LoggedIn Auth
    | LoggingOut


type alias Auth =
    { token : String
    , exp : Int
    , account : Account
    }


type alias Account =
    { id : Int
    , username : String
    }


auth : Session -> Maybe Auth
auth session =
    case session of
        LoggedIn cred_ ->
            Just cred_

        _ ->
            Nothing



-- REQUESTS


type alias Response decodesTo =
    Result (List Error) decodesTo


type alias ResponseToMsg decodesTo msg =
    Response decodesTo -> msg


withSession : Session -> Graphql.Http.Request decodesTo -> Graphql.Http.Request decodesTo
withSession session =
    case auth session of
        Just cred_ ->
            Graphql.Http.withHeader "authorization" ("Bearer " ++ cred_.token)

        Nothing ->
            identity


send : ResponseToMsg decodesTo msg -> Graphql.Http.Request decodesTo -> Cmd msg
send toMsg =
    Graphql.Http.send (Result.mapError decodeError >> toMsg)


sendTask : Graphql.Http.Request decodesTo -> Task.Task (List Error) decodesTo
sendTask request =
    Graphql.Http.toTask request
        |> Task.mapError decodeError


queryRequest : SelectionSet decodesTo RootQuery -> Graphql.Http.Request decodesTo
queryRequest =
    Graphql.Http.queryRequest "/graphql"


mutationRequest : SelectionSet decodesTo Graphql.Operation.RootMutation -> Graphql.Http.Request decodesTo
mutationRequest =
    Graphql.Http.mutationRequest "/graphql"


sendQuery : ResponseToMsg decodesTo msg -> SelectionSet decodesTo RootQuery -> Session -> Cmd msg
sendQuery toMsg selection session =
    selection
        |> queryRequest
        |> withSession session
        |> send toMsg


sendMutation : ResponseToMsg decodesTo msg -> SelectionSet decodesTo Graphql.Operation.RootMutation -> Session -> Cmd msg
sendMutation toMsg selection session =
    selection
        |> mutationRequest
        |> withSession session
        |> send toMsg



-- ERRORS


type Error
    = InvalidCredentialsError
    | DuplicateUsernameError
    | UsernameLengthError
    | PasswordLengthError
    | UnparsedError Graphql.Http.GraphqlError.GraphqlError
    | HttpError Graphql.Http.HttpError


decodeError : Graphql.Http.Error parsedData -> List Error
decodeError error =
    case error of
        Graphql.Http.GraphqlError _ graphqlErrors ->
            List.map
                (\graphqlError ->
                    case graphqlError.message of
                        "invalid credentials" ->
                            InvalidCredentialsError

                        "error returned from database: duplicate key value violates unique constraint \"account_username_key\"" ->
                            DuplicateUsernameError

                        "username must be 1 to 64 characters" ->
                            UsernameLengthError

                        "password must be 1 to 64 characters" ->
                            PasswordLengthError

                        _ ->
                            UnparsedError graphqlError
                )
                graphqlErrors

        Graphql.Http.HttpError httpError ->
            [ HttpError httpError ]


encodeError : Error -> ( String, Maybe Json.Encode.Value )
encodeError error =
    case error of
        InvalidCredentialsError ->
            ( "InvalidCredentialsError", Nothing )

        DuplicateUsernameError ->
            ( "DuplicateUsernameError", Nothing )

        UsernameLengthError ->
            ( "UsernameLengthError", Nothing )

        PasswordLengthError ->
            ( "PasswordLengthError", Nothing )

        UnparsedError err ->
            ( "UnparsedError"
            , Just
                (Json.Encode.object
                    [ ( "message", Json.Encode.string err.message )
                    , ( "locations"
                      , Json.Encode.list
                            (\location ->
                                Json.Encode.object
                                    [ ( "line", Json.Encode.int location.line )
                                    , ( "column", Json.Encode.int location.column )
                                    ]
                            )
                            (Maybe.withDefault [] err.locations)
                      )
                    , ( "details", Json.Encode.dict identity identity err.details )
                    ]
                )
            )

        HttpError err ->
            case err of
                Graphql.Http.BadUrl url ->
                    ( "BadUrl", Just (Json.Encode.object [ ( "url", Json.Encode.string url ) ]) )

                Graphql.Http.Timeout ->
                    ( "Timeout", Nothing )

                Graphql.Http.NetworkError ->
                    ( "NetworkError", Nothing )

                Graphql.Http.BadStatus metadata responseBody ->
                    ( "BadStatus"
                    , Just
                        (Json.Encode.object
                            [ ( "metadata"
                              , Json.Encode.object
                                    [ ( "url", Json.Encode.string metadata.url )
                                    , ( "statusCode", Json.Encode.int metadata.statusCode )
                                    , ( "statusText", Json.Encode.string metadata.statusText )
                                    , ( "headers", Json.Encode.dict identity Json.Encode.string metadata.headers )
                                    ]
                              )
                            , ( "responseBody", Json.Encode.string responseBody )
                            ]
                        )
                    )

                Graphql.Http.BadPayload decoderError ->
                    ( "BadPayload"
                    , Just (Json.Encode.object [ ( "decoderError", Json.Encode.string (Json.Decode.errorToString decoderError) ) ])
                    )

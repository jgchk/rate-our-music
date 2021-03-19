module Utils.Log exposing (LogMutation, apiErrors, error)

import Api
import Api.Enum.LogEnvironment
import Api.Mutation
import Api.Object.Log
import Api.Object.LoggingMutation
import Graphql.OptionalArgument
import Graphql.SelectionSet as SelectionSet exposing (with)
import Json.Encode


type LogMutation
    = LogMutation (List Log)


type Log
    = Log Int


errors : Api.ResponseToMsg LogMutation msg -> Api.Object.LoggingMutation.ErrorsRequiredArguments -> Api.Session -> Cmd msg
errors toMsg args =
    let
        rootSelection =
            SelectionSet.succeed LogMutation
                |> with (Api.Object.LoggingMutation.errors args idSelection)

        idSelection =
            SelectionSet.succeed Log
                |> with Api.Object.Log.id
    in
    Api.sendMutation toMsg (Api.Mutation.logging rootSelection)


error :
    Api.Enum.LogEnvironment.LogEnvironment
    -> Api.ResponseToMsg LogMutation msg
    ->
        { scope : String
        , message : String
        , name : String
        , data : Graphql.OptionalArgument.OptionalArgument String
        }
    -> Api.Session
    -> Cmd msg
error environment toMsg args =
    errors toMsg
        { scope = args.scope
        , environment = environment
        , errors = [ { message = args.message, name = args.name, data = args.data } ]
        }


apiErrors :
    Api.Enum.LogEnvironment.LogEnvironment
    -> Api.ResponseToMsg LogMutation msg
    ->
        { scope : String
        , message : String
        , errors : List Api.Error
        }
    -> Api.Session
    -> Cmd msg
apiErrors environment toMsg args =
    errors toMsg
        { scope = args.scope
        , environment = environment
        , errors =
            List.map
                (\err ->
                    let
                        ( name, data ) =
                            Api.encodeError err
                    in
                    { message = args.message
                    , name = name
                    , data =
                        Graphql.OptionalArgument.fromMaybe <|
                            Maybe.map (Json.Encode.encode 0) data
                    }
                )
                args.errors
        }

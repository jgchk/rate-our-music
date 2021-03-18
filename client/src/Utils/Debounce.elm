module Utils.Debounce exposing (queue)

import Process
import Task


queue : Float -> msg -> Cmd msg
queue lengthMs msg =
    Process.sleep lengthMs
        |> Task.perform (always msg)

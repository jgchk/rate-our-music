module Utils.Route exposing (navigate, openAccountPage)

import Browser.Navigation as Nav
import Spa.Generated.Route as Route exposing (Route)


navigate : Nav.Key -> Route -> Cmd msg
navigate key route =
    Nav.pushUrl key (Route.toString route)


openAccountPage : Nav.Key -> Int -> Cmd msg
openAccountPage key id =
    navigate key (Route.Account__Id_Int { id = id })

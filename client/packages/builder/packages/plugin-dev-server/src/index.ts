import http from 'http'
import { makeKoaServer } from './koa'
import { makeWebsocketServer } from './ws'
import { Plugin, getFullPath } from '@builder/core'

export type DevServerPluginOptions = {
  html: string
  resources: string
}

export const devServerPlugin = (options: DevServerPluginOptions): Plugin => ({
  name: 'dev-server',
  setup: (build) => {
    const cwd = build.initialOptions?.cwd ?? process.cwd()
    const html = getFullPath(cwd)(options.html)
    const resources = getFullPath(cwd)(options.resources)

    const app = makeKoaServer(html, resources)
    const httpServer = http.createServer(app.callback())
    const wsServer = makeWebsocketServer(httpServer)

    httpServer.listen(8080)
    build.onClose(() => {
      httpServer.close()
    })

    build.onBuilt((result) => {
      wsServer.send(result)
    })
  },
})

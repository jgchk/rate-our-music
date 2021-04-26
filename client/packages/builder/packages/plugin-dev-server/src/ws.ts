import { Server } from 'http'
import WebSocket from 'ws'
import { PluginOnBuildResult } from '@builder/core'

export const makeWebsocketServer = (
  server: Server
): {
  server: WebSocket.Server
  send: (msg: PluginOnBuildResult) => void
  close: () => void
} => {
  const wss = new WebSocket.Server({ server })

  return {
    server: wss,
    send: (msg: PluginOnBuildResult) => {
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg))
        }
      }
    },
    close: () => {
      for (const client of wss.clients) {
        client.close()
      }
    },
  }
}

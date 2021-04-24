import { PluginOnBuildResult } from '@builder/core'

const connect = () => {
  const ws = new WebSocket('ws://localhost:8080')

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data) as PluginOnBuildResult
    if (message.name === 'esbuild' && message.message === 'Build succeeded') {
      window.location.reload()
    }
  })

  ws.addEventListener('close', () => setTimeout(() => connect(), 1000))
}

connect()

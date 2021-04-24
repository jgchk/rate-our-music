import { promises as fs } from 'fs'
import Koa from 'koa'
import proxy from 'koa-better-http-proxy'
import send from 'koa-send'

const liveReloadScriptPath = '/live-reload.js'
const snippet = `<script src='${liveReloadScriptPath}' type='module'></script>`

export const makeKoaServer = (html: string, resources: string): Koa => {
  const app = new Koa()

  app.use(async (ctx, next) => {
    if (ctx.path === liveReloadScriptPath) {
      await send(ctx, 'live-reload.js', { root: __dirname })
    } else if (ctx.path === '/graphql') {
      await proxy('http://localhost:3030', {})(ctx, next)
    } else if (['.css', '.js', '.map'].some((ext) => ctx.path.endsWith(ext))) {
      await send(ctx, ctx.path, { root: resources })
    } else {
      const body = await fs.readFile(html, { encoding: 'utf-8' })
      ctx.body = body.replace(/<\/\s*body\s*>/, snippet + '</body>')
    }
  })

  return app
}

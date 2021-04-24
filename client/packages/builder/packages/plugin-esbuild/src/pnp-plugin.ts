import { promises as fs } from 'fs'
import { OnResolveArgs, Plugin } from 'esbuild'
// eslint-disable-next-line import/no-unresolved
import pnp from 'pnpapi'

const pnpResolve = (args: OnResolveArgs) => {
  const path = pnp.resolveRequest(args.path, args.resolveDir + '/', {
    considerBuiltins: true,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  })
  return path ? { path, namespace: 'pnp' } : { external: true }
}

export const pnpPlugin = ({ external = [] } = {}): Plugin => {
  const externalsSet = new Set<string>(external)
  return {
    name: 'pnp-plugin',
    setup(build) {
      // Initial resolve if not a relative path
      build.onResolve({ filter: /^[^./]/ }, (args) => {
        if (externalsSet.has(args.path)) return { external: true }
        return pnpResolve(args)
      })
      // Subsequent resolves within pnp zip files
      build.onResolve({ filter: /.*/, namespace: 'pnp' }, pnpResolve)

      build.onLoad({ filter: /.*/, namespace: 'pnp' }, async (args) => {
        const resolveDir = /(.+\/)/.exec(args.path)?.[1]
        const contents = await fs.readFile(args.path, 'utf8')
        return {
          contents,
          resolveDir,
          loader: 'default',
        }
      })
    },
  }
}

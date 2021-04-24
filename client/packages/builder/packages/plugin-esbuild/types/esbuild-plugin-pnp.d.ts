declare module 'esbuild-plugin-pnp' {
  import { Plugin as ESBuildPlugin } from 'esbuild'
  const plugin: () => ESBuildPlugin
  export default plugin
}

'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.GenericSdkVisitor = exports.validate = exports.plugin = void 0
const path_1 = __importDefault(require('path'))
const graphql_1 = require('graphql')
const utils_1 = require('./utils')
const visitor_1 = require('./visitor')
Object.defineProperty(exports, 'GenericSdkVisitor', {
  enumerable: true,
  get: function () {
    return visitor_1.GenericSdkVisitor
  },
})
const plugin = (schema, documents, config) => {
  const allAst = graphql_1.concatAST(
    documents.map(({ document }) => document).filter(utils_1.isDefined)
  )
  const allFragments = [
    ...allAst.definitions
      .filter((d) => d.kind === graphql_1.Kind.FRAGMENT_DEFINITION)
      .map((fragmentDef) => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      })),
    ...(config.externalFragments || []),
  ]
  const visitor = new visitor_1.GenericSdkVisitor(schema, allFragments, config)
  const visitorResult = graphql_1.visit(allAst, { leave: visitor })
  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter((t) => typeof t === 'string'),
      visitor.sdkContent,
    ].join('\n'),
  }
}
exports.plugin = plugin
const validate = async (schema, documents, config, outputFile) => {
  if (path_1.default.extname(outputFile) !== '.ts') {
    throw new Error(
      `Plugin "typescript-generic-sdk" requires extension to be ".ts"!`
    )
  }
}
exports.validate = validate

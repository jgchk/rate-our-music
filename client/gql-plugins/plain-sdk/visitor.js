'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.GenericSdkVisitor = void 0
const visitor_plugin_common_1 = require('@graphql-codegen/visitor-plugin-common')
const auto_bind_1 = __importDefault(require('auto-bind'))
const graphql_1 = require('graphql')
const utils_1 = require('./utils')
class GenericSdkVisitor extends visitor_plugin_common_1.ClientSideBaseVisitor {
  constructor(schema, fragments, rawConfig) {
    super(schema, fragments, rawConfig, {})
    this._operationsToInclude = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    auto_bind_1.default(this)
    this._additionalImports.push(
      `import { TaskEither } from 'fp-ts/TaskEither'`,
      `import { HttpError } from '../utils/http'`
    )
  }
  buildOperation(
    node,
    documentVariableName,
    operationType,
    operationResultType,
    operationVariablesTypes
  ) {
    this._operationsToInclude.push({
      node,
      documentVariableName,
      operationType,
      operationResultType,
      operationVariablesTypes,
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line unicorn/no-null
    return null
  }
  get sdkContent() {
    const allPossibleActions = this._operationsToInclude
      .map((o) => {
        var _a
        const optionalVariables =
          !o.node.variableDefinitions ||
          o.node.variableDefinitions.length === 0 ||
          o.node.variableDefinitions.every(
            (v) =>
              v.type.kind !== graphql_1.Kind.NON_NULL_TYPE || v.defaultValue
          )
        const name =
          (_a = o.node.name) === null || _a === void 0 ? void 0 : _a.value
        if (!name) return
        const variablesArg = `variables${optionalVariables ? '?' : ''}: ${
          o.operationVariablesTypes
        }`
        return `
          ${name}(${variablesArg}, options?: O): TaskEither<HttpError | GraphqlError, ${o.operationResultType}> {
            return requester<${o.operationResultType}, ${o.operationVariablesTypes}>(${o.documentVariableName}, variables, options);
          }`
      })
      .filter(utils_1.isDefined)
      .map((s) => visitor_plugin_common_1.indentMultiline(s, 2))
    return `
      export type GraphqlResponse<D> =
        | GraphqlSuccessResponse<D>
        | GraphqlErrorResponse

      export type GraphqlSuccessResponse<D> = {
        data: D
        errors: undefined
      }

      export type GraphqlErrorResponse = {
        data: undefined
        errors: GraphqlErr[]
      }

      export type GraphqlErr = {
        locations: GraphqlErrorLocation[]
        message: string
        path: string[]
      }

      export type GraphqlErrorLocation = {
        line: number
        column: number
      }

      export const isErrorResponse = <D>(
        response: GraphqlResponse<D>
      ): response is GraphqlErrorResponse => !!response.errors

      export type GraphqlError = {
        name: 'GraphqlError'
        message?: string
        errors: GraphqlErr[]
      }
      
      export const graphqlError = (
        errors: GraphqlErr[],
        message?: string
      ): GraphqlError => ({ name: 'GraphqlError', message, errors })
      
      export const isGraphqlError = (error: any): error is GraphqlError =>
        typeof error === 'object' && error.name === 'GraphqlError'

      export type Requester<O = Record<string, never>> = <R, V>(doc: string, vars?: V, options?: O) => TaskEither<HttpError | GraphqlError, R>

      export function getSdk<O>(requester: Requester<O>) {
        return {
          ${allPossibleActions.join(',\n')}
        };
      }

      export type Sdk = ReturnType<typeof getSdk>;`
  }
}
exports.GenericSdkVisitor = GenericSdkVisitor

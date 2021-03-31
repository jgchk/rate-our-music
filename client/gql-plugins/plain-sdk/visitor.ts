import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  DocumentMode,
  LoadedFragment,
  indentMultiline,
} from '@graphql-codegen/visitor-plugin-common'
import autoBind from 'auto-bind'
import { GraphQLSchema, Kind, OperationDefinitionNode } from 'graphql'
import { RawGenericSdkPluginConfig } from './config'
import { isDefined } from './utils'

export type GenericSdkPluginConfig = ClientSideBasePluginConfig

export class GenericSdkVisitor extends ClientSideBaseVisitor<
  RawGenericSdkPluginConfig,
  GenericSdkPluginConfig
> {
  private _operationsToInclude: {
    node: OperationDefinitionNode
    documentVariableName: string
    operationType: string
    operationResultType: string
    operationVariablesTypes: string
  }[] = []

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    rawConfig: RawGenericSdkPluginConfig
  ) {
    super(schema, fragments, rawConfig, {})

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    autoBind(this)

    this._additionalImports.push(
      `import { TaskEither } from 'fp-ts/TaskEither'`,
      `import { HttpError } from '../utils/http'`
    )
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
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

  public get sdkContent(): string {
    const allPossibleActions = this._operationsToInclude
      .map((o) => {
        const optionalVariables =
          !o.node.variableDefinitions ||
          o.node.variableDefinitions.length === 0 ||
          o.node.variableDefinitions.every(
            (v) => v.type.kind !== Kind.NON_NULL_TYPE || v.defaultValue
          )

        const name = o.node.name?.value
        if (!name) return

        const variablesArg = `variables${optionalVariables ? '?' : ''}: ${
          o.operationVariablesTypes
        }`

        return `
          ${name}(${variablesArg}, options?: O): TaskEither<HttpError | GraphqlError, ${o.operationResultType}> {
            return requester<${o.operationResultType}, ${o.operationVariablesTypes}>(${o.documentVariableName}, variables, options);
          }`
      })
      .filter(isDefined)
      .map((s) => indentMultiline(s, 2))

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

      export const isGraphqlError = <D>(
        response: GraphqlResponse<D>
      ): response is GraphqlErrorResponse => !!response.errors
      
      export class GraphqlError extends Error {
        name = 'GraphqlError'
        errors: GraphqlErr[]
      
        constructor(errors: GraphqlErr[], message?: string) {
          super(message)
          this.errors = errors
        }
      }

      export type Requester<O = Record<string, never>> = <R, V>(doc: string, vars?: V, options?: O) => TaskEither<HttpError | GraphqlError, R>

      export function getSdk<O>(requester: Requester<O>) {
        return {
          ${allPossibleActions.join(',\n')}
        };
      }

      export type Sdk = ReturnType<typeof getSdk>;`
  }
}

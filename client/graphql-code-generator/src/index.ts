import { PluginFunction } from '@graphql-codegen/plugin-helpers'
import {
  printSchema,
  parse,
  visit,
  Kind,
  FragmentDefinitionNode,
  DocumentNode,
  DefinitionNode,
  print,
  OperationDefinitionNode,
  concatAST,
  SelectionSetNode,
  VariableDefinitionNode,
} from 'graphql'

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const uncapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

const isFragment = (node: DefinitionNode): node is FragmentDefinitionNode =>
  node.kind === Kind.FRAGMENT_DEFINITION

const isOperation = (node: DefinitionNode): node is OperationDefinitionNode =>
  node.kind === Kind.OPERATION_DEFINITION

type FragmentMap = { [name: string]: FragmentDefinitionNode | undefined }
const makeFragmentMap = (ast: DocumentNode): FragmentMap => {
  const map: FragmentMap = {}
  for (const fragment of ast.definitions.filter(isFragment)) {
    map[fragment.name.value] = fragment
  }
  return map
}

export const plugin: PluginFunction = (schema, documents, config) => {
  const ast = concatAST(documents.map((doc) => doc.document).filter(isDefined))

  const fragments = makeFragmentMap(ast)

  const mapSelectionSet = (node: SelectionSetNode): SelectionSetNode => ({
    ...node,
    selections: node.selections.flatMap((selection) => {
      if (selection.kind !== Kind.FRAGMENT_SPREAD) return selection

      const name = selection.name.value
      const fragment = fragments[name]
      if (!fragment)
        throw new Error(`could not find fragment with name: ${name}`)

      return mapSelectionSet(fragment.selectionSet).selections
    }),
  })

  const result: DocumentNode = visit(ast, {
    enter: { SelectionSet: mapSelectionSet },
  })

  const operations = result.definitions.filter(isOperation)

  const docs = []
  const actions = []

  for (const operation of operations) {
    const name = uncapitalize(operation.name?.value ?? '')
    const opType = capitalize(operation.operation)
    const resultType = `${operation.name?.value}${opType}`
    const variablesType = `${resultType}Variables`
    const docType = `${resultType}Document`

    docs.push(`export const ${docType} = \`\n${print(operation)}\``)

    actions.push(`${name}: (variables: ${variablesType}, options?: O): Promise<Result<HttpError | GraphqlError, ${resultType}>> =>
      requester<${resultType}, ${variablesType}>(${docType}, variables, options)
    `)
  }

  const types = [
    `export type GraphqlResponse<D> =
      | GraphqlSuccessResponse<D>
      | GraphqlErrorResponse`,
    `export type GraphqlSuccessResponse<D> = {
      data: D
      errors: undefined
    }`,
    `export type GraphqlErrorResponse = {
      data: undefined
      errors: GraphqlErr[]
    }`,
    `export const isErrorResponse = <D>(
      response: GraphqlResponse<D>
    ): response is GraphqlErrorResponse => !!response.errors`,
    `export type GraphqlErr = {
      locations: GraphqlErrorLocation[]
      message: string
      path: string[]
    }`,
    `export type GraphqlErrorLocation = {
      line: number
      column: number
    }`,
    `export type GraphqlError = {
      name: 'GraphqlError'
      message?: string
      errors: GraphqlErr[]
    }`,
    `export const graphqlError = (
      errors: GraphqlErr[],
      message?: string
    ): GraphqlError => ({ name: 'GraphqlError', message, errors })`,
    `export type Requester<O = Record<string, never>> = <R, V>(doc: string, vars?: V, options?: O) => Promise<Result<HttpError | GraphqlError, R>>`,
  ]

  const sdk = `export const getSdk = <O>(requester: Requester<O>) => ({${actions.join(
    ',\n'
  )}})`

  const imports = [
    `import { HttpError } from '../features/common/utils/http'`,
    `import { Result } from '../features/common/utils/result'`,
  ]

  return {
    content: [docs.join('\n\n'), types.join('\n\n'), sdk].join('\n\n'),
    prepend: imports,
  }
}

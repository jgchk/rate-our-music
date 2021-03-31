import path from 'path'
import {
  PluginFunction,
  PluginValidateFn,
  Types,
} from '@graphql-codegen/plugin-helpers'
import {
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common'
import {
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
  concatAST,
  visit,
} from 'graphql'
import { RawGenericSdkPluginConfig } from './config'
import { isDefined } from './utils'
import { GenericSdkVisitor } from './visitor'

export const plugin: PluginFunction<RawGenericSdkPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawGenericSdkPluginConfig
) => {
  const allAst = concatAST(
    documents.map(({ document }) => document).filter(isDefined)
  )
  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter(
      (d) => d.kind === Kind.FRAGMENT_DEFINITION
    ) as FragmentDefinitionNode[]).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ]
  const visitor = new GenericSdkVisitor(schema, allFragments, config)
  const visitorResult = visit(allAst, { leave: visitor })

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter(
        (t: unknown) => typeof t === 'string'
      ),
      visitor.sdkContent,
    ].join('\n'),
  }
}

export const validate: PluginValidateFn<any> = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawClientSideBasePluginConfig,
  outputFile: string
) => {
  if (path.extname(outputFile) !== '.ts') {
    throw new Error(
      `Plugin "typescript-generic-sdk" requires extension to be ".ts"!`
    )
  }
}

export { GenericSdkVisitor }

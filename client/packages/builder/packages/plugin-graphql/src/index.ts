import { promises as fs } from 'fs'
import { codegen } from '@graphql-codegen/core'
import { plugin as typescriptPlugin } from '@graphql-codegen/typescript'
import { plugin as typescriptOperationsPlugin } from '@graphql-codegen/typescript-operations'
import { plugin as urqlPlugin } from '@graphql-codegen/typescript-urql'
import { GraphQLSchema, printSchema } from 'graphql'
import * as prettier from 'prettier'
import {
  errorFormatter,
  getDocuments,
  getLocalSchema,
  getRemoteSchema,
} from './utils'
import { OnBuildResult, Plugin, getFullPath } from '@builder/core'

export type GraphqlPluginOptions = {
  localSchemaPath: string
  remoteSchemaUrl: string
  documentsPath: string
  outputPath: string
}

export const graphqlPlugin = (options: GraphqlPluginOptions): Plugin => ({
  name: 'graphql',
  setup: (build) => {
    const { remoteSchemaUrl } = options
    const cwd = build.initialOptions?.cwd ?? process.cwd()
    const localSchemaPath = getFullPath(cwd)(options.localSchemaPath)
    const documentsPath = getFullPath(cwd)(options.documentsPath)
    const outputPath = getFullPath(cwd)(options.outputPath)
    const formatError = errorFormatter(cwd)

    const onChange = build.onChange
    if (onChange !== undefined) {
      const checkRemoteSchemaChanged = async () => {
        const localSchema = await getLocalSchema(localSchemaPath)
          .then(printSchema)
          .catch(() => undefined)
        const remoteSchema = await getRemoteSchema(remoteSchemaUrl)
          .then(printSchema)
          .catch(() => undefined)

        if (remoteSchema && (!localSchema || localSchema !== remoteSchema)) {
          onChange({
            message: 'Remote schema changed',
            errors: [],
            warnings: [],
            files: [{ path: localSchemaPath, content: remoteSchema }],
          })
        }
      }

      const interval = setInterval(() => void checkRemoteSchemaChanged(), 5000)

      build.onClose(() => clearInterval(interval))
    }

    build.onBuild({ filter: /\.graphql$/ }, async () => {
      const {
        schema,
        result: schemaResult = {},
      }: {
        schema?: GraphQLSchema
        result?: OnBuildResult
      } = await getLocalSchema(localSchemaPath)
        .then((localSchema) => ({ schema: localSchema }))
        .catch((localSchemaError) =>
          getRemoteSchema(remoteSchemaUrl)
            .then((remoteSchema) => ({
              schema: remoteSchema,
              result: {
                warnings: [formatError(localSchemaError)],
                files:
                  localSchemaPath === undefined
                    ? undefined
                    : [
                        {
                          path: localSchemaPath,
                          content: printSchema(remoteSchema),
                        },
                      ],
              },
            }))
            .catch((remoteSchemaError) => ({
              result: {
                message: 'Could not retrieve schema',
                errors: [
                  formatError(localSchemaError),
                  formatError(remoteSchemaError),
                ],
              },
            }))
        )

      if (schema === undefined) return schemaResult

      const documents =
        documentsPath === undefined ? [] : await getDocuments(documentsPath)

      const {
        output,
        result: codegenResult = {},
      }: { output?: string; result?: OnBuildResult } = await codegen({
        // @ts-ignore
        schema,
        documents,
        plugins: [
          { typescript: {} },
          { typescriptOperations: {} },
          { urql: { urqlImportFrom: '@urql/preact' } },
        ],
        pluginMap: {
          typescript: { plugin: typescriptPlugin },
          typescriptOperations: { plugin: typescriptOperationsPlugin },
          urql: { plugin: urqlPlugin },
        },
      })
        .then((output) => ({ output }))
        .catch((error) => {
          console.log(error)
          return {
            result: {
              message: 'Failed to generate code',
              errors: [formatError(error)],
            },
          }
        })

      if (output === undefined) return codegenResult

      const prettyOutput = await prettier
        .resolveConfigFile()
        .then((path) => (path ? prettier.resolveConfig(path) : undefined))
        .then((config) =>
          prettier.format(output, { ...config, parser: 'typescript' })
        )

      const currentOutputFileContent = await fs.readFile(outputPath, {
        encoding: 'utf-8',
      })
      if (prettyOutput !== currentOutputFileContent) {
        schemaResult.files = [
          ...(schemaResult.files ?? []),
          { path: outputPath, content: prettyOutput },
        ]
      }

      return {
        ...schemaResult,
        message:
          schemaResult.message ?? schemaResult.errors?.length
            ? 'Found errors'
            : schemaResult.warnings?.length
            ? 'Found warnings'
            : 'No issues',
      }
    })
  },
})

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadDocuments, loadSchema } from '@graphql-tools/load'
import { UrlLoader } from '@graphql-tools/url-loader'
import { Source } from '@graphql-tools/utils'
import { GraphQLError, GraphQLSchema } from 'graphql'
import { Issue } from '@builder/core'

export const getLocalSchema = (
  localSchemaPath: string
): Promise<GraphQLSchema> =>
  loadSchema(localSchemaPath, { loaders: [new GraphQLFileLoader()] })

export const getRemoteSchema = (
  remoteSchemaUrl: string
): Promise<GraphQLSchema> =>
  loadSchema(remoteSchemaUrl, { loaders: [new UrlLoader()] })

export const getDocuments = (documentsPath: string): Promise<Source[]> =>
  loadDocuments(documentsPath, { loaders: [new GraphQLFileLoader()] })

const isGraphQLError = (error: Error | GraphQLError): error is GraphQLError =>
  error.name === 'GraphQLError'

export const errorFormatter = (cwd: string) => (
  error: Error | GraphQLError
): Issue => {
  const message: Issue = { text: error.message }

  if (isGraphQLError(error)) {
    const file = error.source?.name.replace(cwd, '')

    if (file !== undefined) {
      const line = error.locations?.[0]?.line
      const column = error.locations?.[0]?.column

      let lineText
      if (line !== undefined) {
        const lines = error.source?.body.split('\n')
        lineText = lines?.[line - 1]
      }

      message.location = {
        file,
        line,
        column,
        lineText,
      }
    }
  }

  return message
}

export const callEvery = (
  fn: () => void | Promise<void>,
  ms: number,
  isCancelled: () => boolean
): void => {
  const callFn = () => {
    if (isCancelled()) return
    void fn()
    setTimeout(callFn, ms)
  }
  callFn()
}

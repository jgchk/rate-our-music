export type GraphQLError = {
  message: string,
  locations: { line: number, column: number }[]
  path: string[]
}

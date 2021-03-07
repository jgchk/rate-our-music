export class InvalidCredentialsError extends Error {
  constructor() {
    super('invalid credentials');
  }
}

export type GraphQLError = {
  message: string,
  locations: { line: number, column: number }[]
  path: string[]
}

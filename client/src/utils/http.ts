import { Either, left, right } from 'fp-ts/Either'

export type Options = {
  method?: HttpMethod
  json?: unknown
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE'

export type Request = { url: string } & RequestInit

export type ResponseAugment = { json: <J>() => Promise<J> }

export type HttpError = {
  name: 'HttpError'
  message?: string
  response: Response
  request: Request
  options: Options
}

const httpError = (
  response: Response,
  request: Request,
  options: Options,
  message?: string
): HttpError => ({
  name: 'HttpError',
  message,
  response,
  request,
  options,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttpError = (error: any): error is HttpError =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof error === 'object' && error.name === 'HttpError'

const send = async (
  url: string,
  options: Options = {}
): Promise<Either<HttpError, Response & ResponseAugment>> => {
  const headers =
    options.json !== undefined
      ? { 'Content-Type': 'application/json' }
      : undefined
  const body =
    options.json !== undefined ? JSON.stringify(options.json) : undefined
  const request = {
    method: options.method,
    headers,
    body,
  }

  try {
    const response = await fetch(url, request).then((r) => {
      if (!r.ok) throw httpError(response, { url, ...request }, options)
      return r
    })

    return right({
      ...response.clone(),
      json: async () => (response.status === 204 ? '' : response.json()),
    })
  } catch (error: unknown) {
    if (isHttpError(error)) return left(error)
    throw error
  }
}

export const post = (
  url: string,
  options: Omit<Options, 'method'> = {}
): Promise<Either<HttpError, Response & ResponseAugment>> =>
  send(url, { method: 'POST', ...options })

import { left, right } from 'fp-ts/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither'

export type Options = {
  method?: HttpMethod
  json?: unknown
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE'

export type Request = { url: string } & RequestInit

export type ResponseAugment = { json: <J>() => Promise<J> }

export class HttpError extends Error {
  name = 'HttpError'
  response: Response
  request: Request
  options: Options

  constructor(response: Response, request: Request, options: Options) {
    // Set the message to the status text, such as Unauthorized,
    // with some fallbacks. This message should never be undefined.
    super(
      response.statusText ||
        String(
          response.status === 0 || response.status
            ? response.status
            : 'Unknown response error'
        )
    )
    this.response = response
    this.request = request
    this.options = options
  }
}

const send = (
  url: string,
  options: Options = {}
): TaskEither<HttpError, Response & ResponseAugment> => async () => {
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
      if (!r.ok) throw new HttpError(r, { url, ...request }, options)
      return r
    })

    return right({
      ...response.clone(),
      json: async () => (response.status === 204 ? '' : response.json()),
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) return left(error)
    throw error
  }
}

export const post = (
  url: string,
  options: Omit<Options, 'method'> = {}
): TaskEither<HttpError, Response & ResponseAugment> =>
  send(url, { method: 'POST', ...options })

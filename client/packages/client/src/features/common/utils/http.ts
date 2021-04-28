import { Result, err, ok } from './result'

export type Options = {
  method?: HttpMethod
  json?: unknown
  headers?: Record<string, string>
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

export type ConnectionRefusedError = {
  name: 'ConnectionRefusedError'
}

const connectionRefusedError = (): ConnectionRefusedError => ({
  name: 'ConnectionRefusedError',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttpError = (error: any): error is HttpError =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof error === 'object' && error.name === 'HttpError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isConnectionRefusedError = (error: any): boolean =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof error === 'object' && error.message === 'Failed to fetch'

const send = async (
  url: string,
  options: Options = {}
): Promise<
  Result<HttpError | ConnectionRefusedError, Response & ResponseAugment>
> => {
  const headers = {
    ...(options.json !== undefined
      ? { 'Content-Type': 'application/json' }
      : undefined),
    ...options.headers,
  }
  const body =
    options.json !== undefined ? JSON.stringify(options.json) : undefined
  const request = {
    method: options.method,
    headers,
    body,
  }

  try {
    const response = await fetch(url, request).then((r) => {
      if (!r.ok) throw httpError(r, { url, ...request }, options)
      return r
    })

    return ok({
      ...response.clone(),
      json: async () => (response.status === 204 ? '' : response.json()),
    })
  } catch (error: unknown) {
    if (isHttpError(error)) return err(error)
    if (isConnectionRefusedError(error)) return err(connectionRefusedError())
    throw error
  }
}

export const post = (
  url: string,
  options: Omit<Options, 'method'> = {}
): Promise<
  Result<HttpError | ConnectionRefusedError, Response & ResponseAugment>
> => send(url, { method: 'POST', ...options })

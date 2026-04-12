import { ApiError } from './api-error'
import { env } from './env'

type TokenGetter = () => Promise<string | null>

let getToken: TokenGetter = async () => null

export const setTokenGetter = (getter: TokenGetter) => {
    getToken = getter
}

interface FetchOptions {
    auth?: boolean
    headers?: Record<string, string>
    signal?: AbortSignal
}

const fetchApi = async <T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    options: FetchOptions = {},
): Promise<T> => {
    const url = `${env.apiBaseUrl}${path}`
    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.headers || {}),
    }

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json'
    }

    if (options.auth !== false) {
        const token = await getToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    const response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    const parsed = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

    if (!response.ok) {
        throw new ApiError(response.status, parsed)
    }

    return parsed as T
}

export const apiClient = {
    get: <T>(path: string, options?: FetchOptions) =>
        fetchApi<T>('GET', path, undefined, options),
    post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
        fetchApi<T>('POST', path, body, options),
    patch: <T>(path: string, body?: unknown, options?: FetchOptions) =>
        fetchApi<T>('PATCH', path, body, options),
    del: <T>(path: string, body?: unknown, options?: FetchOptions) =>
        fetchApi<T>('DELETE', path, body, options),
}

/**
 * API Service Layer
 * Centralizes HTTP communication with the backend
 */

export interface TRequestOptions extends Omit<RequestInit, 'body'> {
    params?: Record<string, unknown>
    body?: unknown
    retry?: number
    retryDelay?: number
    retryStatusCodes?: number[]
    retryOnNetworkError?: boolean
}

export interface TApiError {
    message: string
    status?: number
    code?: string
}

export class ApiError extends Error implements TApiError {
    status?: number
    code?: string

    constructor(message: string, status?: number, code?: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
    }
}

export interface ApiRequestContext {
    endpoint: string
    options: TRequestOptions
}

export type ApiRequestInterceptor = (context: ApiRequestContext) => Promise<ApiRequestContext> | ApiRequestContext
export type ApiResponseInterceptor = (response: Response) => Promise<Response> | Response
export type ApiErrorInterceptor = (error: Error) => Promise<void> | void

const requestInterceptors: ApiRequestInterceptor[] = []
const responseInterceptors: ApiResponseInterceptor[] = []
const errorInterceptors: ApiErrorInterceptor[] = []

export function addRequestInterceptor(interceptor: ApiRequestInterceptor) {
    requestInterceptors.push(interceptor)
}

export function addResponseInterceptor(interceptor: ApiResponseInterceptor) {
    responseInterceptors.push(interceptor)
}

export function addErrorInterceptor(interceptor: ApiErrorInterceptor) {
    errorInterceptors.push(interceptor)
}

export const apiInterceptors = {
    request: { use: addRequestInterceptor },
    response: { use: addResponseInterceptor },
    error: { use: addErrorInterceptor },
}

const DEFAULT_RETRY_COUNT = 2
const DEFAULT_RETRY_DELAY = 300
const DEFAULT_RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504]

const isJsonResponse = (response: Response) => {
    const contentType = response.headers.get('content-type')
    return contentType?.includes('application/json') ?? false
}

const parseResponseBody = async <T>(response: Response): Promise<T> => {
    if (response.status === 204 || response.status === 205) {
        return undefined as T
    }

    if (!isJsonResponse(response)) {
        return undefined as T
    }

    const text = await response.text()
    if (!text) return undefined as T

    try {
        return JSON.parse(text) as T
    } catch {
        throw new ApiError('Invalid JSON response', response.status, 'INVALID_JSON')
    }
}

const buildUrl = (endpoint: string, params?: Record<string, unknown>) => {
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${process.env.NEXT_PUBLIC_API_URL || '/api'}${endpoint}`

    if (!params || Object.keys(params).length === 0) {
        return url
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
        }
    })

    return `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const isRetryableStatus = (status: number, retryStatusCodes: number[]) =>
    retryStatusCodes.includes(status)

const shouldRetryNetworkError = (error: unknown) =>
    error instanceof Error && error.name !== 'AbortError'

const normalizeBody = (body: unknown, headers: Headers): BodyInit | null | undefined => {
    if (
        body == null ||
        typeof body === 'string' ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body)
    ) {
        return body as BodyInit
    }

    if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json')
    }

    return JSON.stringify(body)
}

async function executeFetch(
    requestUrl: string,
    requestInit: RequestInit,
    retryCount: number,
    retryDelay: number,
    retryStatusCodes: number[],
    retryOnNetworkError: boolean
) {
    let attempt = 0

    while (true) {
        try {
            const response = await fetch(requestUrl, requestInit)

            if (attempt < retryCount && isRetryableStatus(response.status, retryStatusCodes)) {
                attempt += 1
                await delay(retryDelay * attempt)
                continue
            }

            return response
        } catch (error) {
            if (attempt < retryCount && retryOnNetworkError && shouldRetryNetworkError(error)) {
                attempt += 1
                await delay(retryDelay * attempt)
                continue
            }

            throw error
        }
    }
}

const extractErrorMessage = async (response: Response) => {
    if (isJsonResponse(response)) {
        try {
            const errorBody = await response.json()
            return (
                errorBody?.message ||
                errorBody?.error ||
                `HTTP ${response.status}: ${response.statusText}`
            )
        } catch {
            return `HTTP ${response.status}: ${response.statusText}`
        }
    }

    return `HTTP ${response.status}: ${response.statusText}`
}

const runErrorInterceptors = async (error: Error) => {
    for (const interceptor of errorInterceptors) {
        await interceptor(error)
    }
}

export async function apiFetch<T = unknown>(
    endpoint: string,
    options: TRequestOptions = {}
): Promise<T> {
    let context: ApiRequestContext = { endpoint, options }

    for (const interceptor of requestInterceptors) {
        context = await interceptor(context)
    }

    const {
        params,
        retry = DEFAULT_RETRY_COUNT,
        retryDelay = DEFAULT_RETRY_DELAY,
        retryStatusCodes = DEFAULT_RETRY_STATUS_CODES,
        retryOnNetworkError = true,
        ...fetchOptions
    } = context.options

    const url = buildUrl(context.endpoint, params)

    let authToken: string | null = null
    if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('studyhub:token')
    }

    const headers = new Headers(fetchOptions.headers)
    if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`)
    }

    const body = normalizeBody(fetchOptions.body, headers)
    const requestInit: RequestInit = {
        ...fetchOptions,
        headers,
        body,
    }

    try {
        const response = await executeFetch(
            url,
            requestInit,
            retry,
            retryDelay,
            retryStatusCodes,
            retryOnNetworkError
        )

        for (const interceptor of responseInterceptors) {
            await interceptor(response)
        }

        if (!response.ok) {
            const message = await extractErrorMessage(response)
            const code = response.status === 401 ? 'UNAUTHORIZED' : undefined
            throw new ApiError(message, response.status, code)
        }

        return await parseResponseBody<T>(response)
    } catch (error) {
        if (error instanceof ApiError) {
            await runErrorInterceptors(error)
            throw error
        }

        const apiError = new ApiError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'NETWORK_ERROR'
        )
        await runErrorInterceptors(apiError)
        throw apiError
    }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
    get: <T = unknown>(endpoint: string, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = unknown>(endpoint: string, data?: unknown, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data,
        }),

    put: <T = unknown>(endpoint: string, data?: unknown, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data,
        }),

    patch: <T = unknown>(endpoint: string, data?: unknown, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data,
        }),

    delete: <T = unknown>(endpoint: string, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
}

/**
 * API Service Layer
 * Centralizes HTTP communication with the backend
 */

export interface TRequestOptions extends RequestInit {
    // Allow unknown values in params — callers may pass different filter shapes
    params?: Record<string, unknown>
}

export interface TApiError {
    message: string
    status?: number
    code?: string
}

class ApiError extends Error implements TApiError {
    status?: number
    code?: string

    constructor(message: string, status?: number, code?: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
    }
}

/**
 * Fetch wrapper with error handling and request/response interceptors
 * 
 * @param endpoint - API endpoint (e.g., '/tasks', '/notes')
 * @param options - Request options (method, headers, body, params)
 * @returns Promise with typed response data
 * 
 * @example
 * ```ts
 * // GET request
 * const tasks = await apiFetch<TTask[]>('/tasks')
 * 
 * // POST request
 * const newTask = await apiFetch<TTask>('/tasks', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'New task' })
 * })
 * 
 * // With query params
 * const tasks = await apiFetch<TTask[]>('/tasks', {
 *   params: { status: 'active', limit: 10 }
 * })
 * ```
 */
export async function apiFetch<T = unknown>(
    endpoint: string,
    options: TRequestOptions = {}
): Promise<T> {
    const { params, ...fetchOptions } = options

    // Build URL with query parameters
    let url = endpoint.startsWith('http')
        ? endpoint
        : `${process.env.NEXT_PUBLIC_API_URL || '/api'}${endpoint}`

    if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value))
        })
        url += `?${searchParams.toString()}`
    }

    // Attach auth token (if present) and default headers
    let authToken: string | null = null
    if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('studyhub:token')
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...fetchOptions.headers,
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        })

        // Handle non-OK responses
        if (!response.ok) {
            // Special handling for unauthorized responses
            if (response.status === 401) {
                throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
            }

            let errorMessage = `HTTP ${response.status}: ${response.statusText}`

            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorData.error || errorMessage
            } catch {
                // Response body is not JSON
            }

            throw new ApiError(errorMessage, response.status)
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return undefined as T
        }

        // Parse JSON response
        const data = await response.json()
        return data as T
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        // Network errors, JSON parse errors, etc.
        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            undefined,
            'NETWORK_ERROR'
        )
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
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T = unknown>(endpoint: string, data?: unknown, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T = unknown>(endpoint: string, data?: unknown, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T = unknown>(endpoint: string, options?: TRequestOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
}

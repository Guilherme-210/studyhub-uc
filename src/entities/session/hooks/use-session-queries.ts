/**
 * Session Query Hooks
 * React Query hooks for session entity (study sessions)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services'
import type { TSession, TSessionCreate, TSessionUpdate } from '../types'

// Query Keys
export const SESSION_QUERY_KEYS = {
    all: ['sessions'] as const,
    lists: () => [...SESSION_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...SESSION_QUERY_KEYS.lists(), filters] as const,
    details: () => [...SESSION_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...SESSION_QUERY_KEYS.details(), id] as const,
}

/**
 * Hook to fetch all sessions
 */
export function useGetSessions(filters?: Record<string, unknown>) {
    return useQuery({
        queryKey: SESSION_QUERY_KEYS.list(filters),
        queryFn: () => api.get<TSession[]>('/sessions', { params: filters }),
    })
}

/**
 * Hook to fetch a single session by ID
 */
export function useGetSession(id: string) {
    return useQuery({
        queryKey: SESSION_QUERY_KEYS.detail(id),
        queryFn: () => api.get<TSession>(`/sessions/${id}`),
        enabled: !!id,
    })
}

/**
 * Hook to create a new session
 */
export function useCreateSession() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TSessionCreate) => api.post<TSession>('/sessions', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to update an existing session
 */
export function useUpdateSession() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TSessionUpdate }) =>
            api.patch<TSession>(`/sessions/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to delete a session
 */
export function useDeleteSession() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.delete(`/sessions/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to start a session
 */
export function useStartSession() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.post<TSession>(`/sessions/${id}/start`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.detail(id) })
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to end a session
 */
export function useEndSession() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.post<TSession>(`/sessions/${id}/end`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.detail(id) })
            queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.lists() })
        },
    })
}

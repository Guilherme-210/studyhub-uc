/**
 * Group Query Hooks
 * React Query hooks for group entity
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services'
import type { TStudyGroup, TGroupCreate, TGroupUpdate } from '../types'

// Query Keys 
export const GROUP_QUERY_KEYS = {
    all: ['groups'] as const,
    lists: () => [...GROUP_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...GROUP_QUERY_KEYS.lists(), filters] as const,
    details: () => [...GROUP_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...GROUP_QUERY_KEYS.details(), id] as const,
}

/**
 * Hook to fetch all groups
 */
export function useGetGroups(filters?: Record<string, number | boolean>) {
    return useQuery({
        queryKey: GROUP_QUERY_KEYS.list(filters),
        queryFn: () => api.get<TStudyGroup[]>('/groups', { params: filters }),
    })
}

/**
 * Hook to fetch a single group by ID
 */
export function useGetGroup(id: string) {
    return useQuery({
        queryKey: GROUP_QUERY_KEYS.detail(id),
        queryFn: () => api.get<TStudyGroup>(`/groups/${id}`),
        enabled: !!id,
    })
}

/**
 * Hook to create a new group
 */
export function useCreateGroup() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TGroupCreate) => api.post<TStudyGroup>('/groups', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to update an existing group
 */
export function useUpdateGroup() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TGroupUpdate }) =>
            api.patch<TStudyGroup>(`/groups/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to delete a group
 */
export function useDeleteGroup() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.delete(`/groups/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to join a group
 */
export function useJoinGroup() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.post(`/groups/${id}/join`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.detail(id) })
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to leave a group
 */
export function useLeaveGroup() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.post(`/groups/${id}/leave`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.detail(id) })
            queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.lists() })
        },
    })
}

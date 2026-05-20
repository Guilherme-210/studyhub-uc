/**
 * Task Query Hooks
 * React Query hooks for task entity
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@services'
import type { TTask, TTaskCreate, TTaskUpdate } from '../types'

// Query Keys
export const TASK_QUERY_KEYS = {
    all: ['tasks'] as const,
    lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...TASK_QUERY_KEYS.lists(), filters] as const,
    details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...TASK_QUERY_KEYS.details(), id] as const,
}

/**
 * Hook to fetch all tasks
 */
export function useGetTasks(filters?: Record<string, unknown>) {
    return useQuery({
        queryKey: TASK_QUERY_KEYS.list(filters),
        queryFn: () => taskService.getTasks(filters),
    })
}

/**
 * Hook to fetch a single task by ID
 */
export function useGetTask(id: string) {
    return useQuery({
        queryKey: TASK_QUERY_KEYS.detail(id),
        queryFn: () => taskService.getTask(id),
        enabled: !!id,
    })
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TTaskCreate) => taskService.createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to update an existing task
 */
export function useUpdateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TTaskUpdate }) =>
            taskService.updateTask(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => taskService.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to toggle task completion
 */
export function useToggleTaskCompletion() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            taskService.toggleComplete(id, completed),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
        },
    })
}

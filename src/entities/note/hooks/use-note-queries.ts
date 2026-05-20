/**
 * Note Query Hooks
 * React Query hooks for note entity
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { noteService } from '@services'
import type { TNote, TNoteCreate, TNoteUpdate } from '../types'

// Query Keys
export const NOTE_QUERY_KEYS = {
    all: ['notes'] as const,
    lists: () => [...NOTE_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...NOTE_QUERY_KEYS.lists(), filters] as const,
    details: () => [...NOTE_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...NOTE_QUERY_KEYS.details(), id] as const,
}

/**
 * Hook to fetch all notes
 */
export function useGetNotes(filters?: Record<string, unknown>) {
    return useQuery({
        queryKey: NOTE_QUERY_KEYS.list(filters),
        queryFn: () => noteService.getNotes(filters),
    })
}

/**
 * Hook to fetch a single note by ID
 */
export function useGetNote(id: string) {
    return useQuery({
        queryKey: NOTE_QUERY_KEYS.detail(id),
        queryFn: () => noteService.getNote(id),
        enabled: !!id,
    })
}

/**
 * Hook to create a new note
 */
export function useCreateNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TNoteCreate) => noteService.createNote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to update an existing note
 */
export function useUpdateNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TNoteUpdate }) =>
            noteService.updateNote(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to delete a note
 */
export function useDeleteNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => noteService.deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() })
        },
    })
}

/**
 * Hook to toggle note pinned status
 */
export function useToggleNotePinned() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) =>
            noteService.togglePinned(id, pinned),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() })
        },
    })
}

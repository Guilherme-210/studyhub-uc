import { api } from './api'
import type { TNote, TNoteCreate, TNoteUpdate } from '@entities/note/types'

export const noteService = {
  getNotes: (filters?: Record<string, unknown>) =>
    api.get<TNote[]>('/notes', { params: filters }),

  getNote: (id: string) =>
    api.get<TNote>(`/notes/${id}`),

  createNote: (data: TNoteCreate) =>
    api.post<TNote>('/notes', data),

  updateNote: (id: string, data: TNoteUpdate) =>
    api.patch<TNote>(`/notes/${id}`, data),

  deleteNote: (id: string) =>
    api.delete(`/notes/${id}`),

  togglePinned: (id: string, pinned: boolean) =>
    api.patch<TNote>(`/notes/${id}`, { pinned }),
}

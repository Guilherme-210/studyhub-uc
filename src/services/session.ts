import { api } from './api'
import type { TSession, TSessionCreate, TSessionUpdate } from '@entities/session/types'

export const sessionService = {
  getSessions: (filters?: Record<string, unknown>) =>
    api.get<TSession[]>('/sessions', { params: filters }),

  getSession: (id: string) =>
    api.get<TSession>(`/sessions/${id}`),

  createSession: (data: TSessionCreate) =>
    api.post<TSession>('/sessions', data),

  updateSession: (id: string, data: TSessionUpdate) =>
    api.patch<TSession>(`/sessions/${id}`, data),

  deleteSession: (id: string) =>
    api.delete(`/sessions/${id}`),

  startSession: (id: string) =>
    api.post<TSession>(`/sessions/${id}/start`),

  endSession: (id: string) =>
    api.post<TSession>(`/sessions/${id}/end`),
}

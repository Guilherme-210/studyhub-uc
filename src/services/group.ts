import { api } from './api'
import type { TStudyGroup, TGroupCreate, TGroupUpdate } from '@entities/group/types'

export const groupService = {
  getGroups: (filters?: Record<string, unknown>) =>
    api.get<TStudyGroup[]>('/groups', { params: filters }),

  getGroup: (id: string) =>
    api.get<TStudyGroup>(`/groups/${id}`),

  createGroup: (data: TGroupCreate) =>
    api.post<TStudyGroup>('/groups', data),

  updateGroup: (id: string, data: TGroupUpdate) =>
    api.patch<TStudyGroup>(`/groups/${id}`, data),

  deleteGroup: (id: string) =>
    api.delete(`/groups/${id}`),

  joinGroup: (id: string) =>
    api.post(`/groups/${id}/join`),

  leaveGroup: (id: string) =>
    api.post(`/groups/${id}/leave`),
}

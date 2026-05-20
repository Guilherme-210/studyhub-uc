import { api } from './api'
import type { TTask, TTaskCreate, TTaskUpdate } from '@entities/task/types'

export const taskService = {
  getTasks: (filters?: Record<string, unknown>) =>
    api.get<TTask[]>('/tasks', { params: filters }),

  getTask: (id: string) =>
    api.get<TTask>(`/tasks/${id}`),

  createTask: (data: TTaskCreate) =>
    api.post<TTask>('/tasks', data),

  updateTask: (id: string, data: TTaskUpdate) =>
    api.patch<TTask>(`/tasks/${id}`, data),

  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`),

  toggleComplete: (id: string, completed: boolean) =>
    api.patch<TTask>(`/tasks/${id}`, { completed }),
}

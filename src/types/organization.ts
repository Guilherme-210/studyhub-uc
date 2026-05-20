// Tipos para o sistema de organização

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  tasks: KanbanTask[]
}

export interface KanbanTask {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  tags?: string[]
  dueDate?: string
  createdAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay: boolean
  color: string
  type: 'class' | 'exam' | 'assignment' | 'study' | 'other'
  reminder?: number // minutes before
}

export interface Note {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface PomodoroSettings {
  workDuration: number // minutes
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
}

export interface PomodoroSession {
  id: string
  date: string
  completedPomodoros: number
  totalMinutes: number
  tasks?: string[]
}

export interface StudyStats {
  totalPomodoros: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  tasksCompleted: number
  lastStudyDate?: string
}

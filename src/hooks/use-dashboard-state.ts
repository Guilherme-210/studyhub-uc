'use client'

import { useLocalStorage } from './use-local-storage'
import type { CalendarEvent, StudyStats } from '@/types/organization'

export function useDashboardPreferences() {
  const [events] = useLocalStorage<CalendarEvent[]>('studyhub-events', [])
  const [stats] = useLocalStorage<StudyStats>('studyhub-stats', {
    totalPomodoros: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    tasksCompleted: 0,
  })

  return {
    events,
    stats,
  }
}

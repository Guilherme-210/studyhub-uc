/**
 * Session Entity Types (Study Sessions)
 */

export type TSessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled'

export interface TSession {
    id: string
    groupId?: string
    title: string
    description?: string
    scheduledAt: string
    startedAt?: string
    endedAt?: string
    duration: number // em minutos
    status: TSessionStatus
    createdBy: string
    participants: string[]
    createdAt: string
    updatedAt: string
}

export interface TSessionCreate {
    groupId?: string
    title: string
    description?: string
    scheduledAt: string
    duration: number
}

export interface TSessionUpdate {
    title?: string
    description?: string
    scheduledAt?: string
    duration?: number
    status?: TSessionStatus
}

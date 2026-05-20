/**
 * Task Entity Types
 */

export interface TTask {
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

export interface TTaskCreate {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    tags?: string[]
}

export interface TTaskUpdate {
    title?: string
    description?: string
    completed?: boolean
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    tags?: string[]
}

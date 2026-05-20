/**
 * Note Entity Types
 */

export interface TNote {
    id: string
    title: string
    content: string
    color: string
    pinned: boolean
    tags?: string[]
    createdAt: string
    updatedAt: string
}

export interface TNoteCreate {
    title: string
    content: string
    color?: string
    pinned?: boolean
    tags?: string[]
}

export interface TNoteUpdate {
    title?: string
    content?: string
    color?: string
    pinned?: boolean
    tags?: string[]
}

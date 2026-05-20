/**
 * Group Entity Types
 */

// Tipos de grupo
export type TGroupType = 'official' | 'community'

// Privacidade do grupo
export type TGroupPrivacy = 'public' | 'private' | 'invite-only'

// Status do grupo
export type TGroupStatus = 'active' | 'inactive' | 'featured'

// Papéis dentro do grupo
export type TMemberRole = 'admin' | 'moderator' | 'member'

// Nível de atividade
export type TActivityLevel = 'high' | 'medium' | 'low'

// Categorias de grupos
export const GROUP_CATEGORIES = [
    'Matemática',
    'Física',
    'Química',
    'Biologia',
    'Programação',
    'Engenharia',
    'Direito',
    'Medicina',
    'Administração',
    'Economia',
    'Psicologia',
    'Letras',
    'História',
    'Geografia',
    'Filosofia',
    'Sociologia',
    'Contabilidade',
    'Arquitetura',
    'Design',
    'Outros'
] as const

export type TGroupCategory = typeof GROUP_CATEGORIES[number]

// Membro do grupo
export interface TGroupMember {
    id: string
    name: string
    avatar?: string
    role: TMemberRole
    joinedAt: string
    studyHours: number
}

// Solicitação de entrada
export interface TJoinRequest {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    message?: string
    requestedAt: string
    status: 'pending' | 'approved' | 'rejected'
}

// Sessão de estudo do grupo
export interface TGroupStudySession {
    id: string
    title: string
    description?: string
    scheduledAt: string
    duration: number // em minutos
    createdBy: string
    participants: string[]
}

// Notificação do grupo
export interface TGroupNotification {
    id: string
    groupId: string
    type: 'new_member' | 'new_message' | 'study_session' | 'announcement'
    title: string
    message: string
    createdAt: string
    read: boolean
}

// Grupo de estudo
export interface TStudyGroup {
    id: string
    name: string
    description: string
    type: TGroupType
    privacy: TGroupPrivacy
    status: TGroupStatus
    category: TGroupCategory
    coverImage?: string
    inviteCode?: string

    // Criador/Admin
    createdBy: string
    createdAt: string

    // Membros
    members: TGroupMember[]
    maxMembers?: number

    // Solicitações pendentes (para grupos privados)
    joinRequests: TJoinRequest[]

    // Sessões de estudo
    studySessions: TGroupStudySession[]

    // Métricas
    totalStudyHours: number
    activityLevel: TActivityLevel
    messagesCount: number

    // Regras do grupo
    rules?: string[]

    // Tags
    tags?: string[]
}

// Permissões por papel
export const ROLE_PERMISSIONS: Record<TMemberRole, string[]> = {
    admin: [
        'edit_group',
        'delete_group',
        'manage_members',
        'approve_requests',
        'remove_members',
        'create_sessions',
        'edit_sessions',
        'delete_sessions',
        'manage_moderators',
        'send_announcements'
    ],
    moderator: [
        'approve_requests',
        'remove_members',
        'create_sessions',
        'edit_sessions',
        'manage_reports'
    ],
    member: [
        'view_content',
        'participate_sessions',
        'send_messages'
    ]
}

// DTOs
export interface TGroupCreate {
    name: string
    description: string
    type?: TGroupType
    privacy?: TGroupPrivacy
    category: TGroupCategory
    coverImage?: string
    maxMembers?: number
    rules?: string[]
    tags?: string[]
}

export interface TGroupUpdate {
    name?: string
    description?: string
    privacy?: TGroupPrivacy
    category?: TGroupCategory
    coverImage?: string
    maxMembers?: number
    rules?: string[]
    tags?: string[]
}

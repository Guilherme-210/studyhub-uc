// Tipos para o sistema de grupos de estudo

// Tipos de grupo
export type GroupType = 'official' | 'community'

// Privacidade do grupo
export type GroupPrivacy = 'public' | 'private' | 'invite-only'

// Status do grupo
export type GroupStatus = 'active' | 'inactive' | 'featured'

// Papéis dentro do grupo
export type MemberRole = 'admin' | 'moderator' | 'member'

// Nível de atividade
export type ActivityLevel = 'high' | 'medium' | 'low'

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

export type GroupCategory = typeof GROUP_CATEGORIES[number]

// Membro do grupo
export interface GroupMember {
  id: string
  name: string
  avatar?: string
  role: MemberRole
  joinedAt: string
  studyHours: number
}

// Solicitação de entrada
export interface JoinRequest {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  message?: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

// Sessão de estudo do grupo
export interface GroupStudySession {
  id: string
  title: string
  description?: string
  scheduledAt: string
  duration: number // em minutos
  createdBy: string
  participants: string[]
  isPermanent?: boolean // Sessão não expira automaticamente
  isPinned?: boolean // Sessão fixada no topo
  order?: number // Ordem customizada (drag-and-drop)
}

// Notificação do grupo
export interface GroupNotification {
  id: string
  groupId: string
  type: 'new_member' | 'new_message' | 'study_session' | 'announcement'
  title: string
  message: string
  createdAt: string
  read: boolean
}

// Grupo de estudo
export interface StudyGroup {
  id: string
  name: string
  description: string
  type: GroupType
  privacy: GroupPrivacy
  status: GroupStatus
  category: GroupCategory
  coverImage?: string
  inviteCode?: string

  // Criador/Admin
  createdBy: string
  createdAt: string

  // Membros
  members: GroupMember[]
  maxMembers?: number

  // Solicitações pendentes (para grupos privados)
  joinRequests: JoinRequest[]

  // Sessões de estudo
  studySessions: GroupStudySession[]

  // Métricas
  totalStudyHours: number
  activityLevel: ActivityLevel
  messagesCount: number

  // Regras do grupo
  rules?: string[]

  // Tags
  tags?: string[]
}

// Permissões por papel
export const ROLE_PERMISSIONS: Record<MemberRole, string[]> = {
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

// Função para verificar permissão
export function hasPermission(role: MemberRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

// Função para gerar código de convite
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Labels em português
export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  official: 'Oficial',
  community: 'Comunidade'
}

export const GROUP_PRIVACY_LABELS: Record<GroupPrivacy, string> = {
  public: 'Público',
  private: 'Privado',
  'invite-only': 'Apenas Convite'
}

export const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  featured: 'Em Destaque'
}

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  admin: 'Administrador',
  moderator: 'Moderador',
  member: 'Membro'
}

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa'
}

// Tipos para mensagens de chat

// Tipo de mensagem
export type MessageType = 'text' | 'image' | 'file' | 'system' | 'poll'

// Reação de mensagem
export interface MessageReaction {
  emoji: string
  users: string[]
}

// Mensagem de chat
export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: MessageType
  timestamp: string
  edited?: boolean
  editedAt?: string
  replyTo?: {
    id: string
    senderName: string
    content: string
  }
  reactions?: MessageReaction[]
  attachments?: {
    name: string
    url: string
    type: string
    size: number
  }[]
  poll?: {
    question: string
    options: {
      id: string
      text: string
      votes: string[]
    }[]
    multipleChoice: boolean
    endsAt?: string
  }
}

// Conversa/Chat
export interface Conversation {
  id: string
  type: 'direct' | 'group' | 'session'
  name: string
  avatar?: string
  participants: {
    id: string
    name: string
    avatar?: string
    online?: boolean
    lastSeen?: string
  }[]
  lastMessage?: {
    content: string
    senderId: string
    senderName: string
    timestamp: string
  }
  unreadCount: number
  messages: ChatMessage[]
  groupId?: string
  sessionId?: string
  createdAt: string
  updatedAt: string
}

// Status de digitação
export interface TypingStatus {
  odtconversationId: string
  userId: string
  userName: string
  timestamp: string
}

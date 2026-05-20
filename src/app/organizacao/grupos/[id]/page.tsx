'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  Users,
  Lock,
  Globe,
  Mail,
  Star,
  Clock,
  TrendingUp,
  Crown,
  Shield,
  BookOpen,
  Settings,
  MoreVertical,
  UserPlus,
  UserMinus,
  MessageSquare,
  Calendar,
  Play,
  Copy,
  Check,
  Flag,
  LogOut,
  Trash2,
  Edit,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pin,
  GripVertical,
  Infinity,
} from 'lucide-react'
import {
  StudyGroup,
  GroupStudySession,
  MemberRole,
  GROUP_TYPE_LABELS,
  GROUP_PRIVACY_LABELS,
  GROUP_STATUS_LABELS,
  MEMBER_ROLE_LABELS,
  ACTIVITY_LEVEL_LABELS,
  hasPermission,
  generateInviteCode,
} from '@/types/groups'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Mock data - mesmo do page anterior
const MOCK_GROUPS: StudyGroup[] = [
  {
    id: '1',
    name: 'Cálculo Avançado - Turma 2024',
    description: 'Grupo oficial da disciplina de Cálculo III para discussões e resolução de exercícios em conjunto.',
    type: 'official',
    privacy: 'private',
    status: 'featured',
    category: 'Matemática',
    createdBy: 'Prof. Silva',
    createdAt: '2024-01-15',
    members: [
      { id: '1', name: 'Prof. Silva', role: 'admin', joinedAt: '2024-01-15', studyHours: 120 },
      { id: '2', name: 'Maria Santos', role: 'moderator', joinedAt: '2024-01-16', studyHours: 45 },
      { id: '3', name: 'João Pedro', role: 'member', joinedAt: '2024-01-17', studyHours: 32 },
      { id: 'current-user', name: 'Você', role: 'member', joinedAt: '2024-02-01', studyHours: 15 },
    ],
    maxMembers: 50,
    joinRequests: [
      { id: '1', userId: '10', userName: 'Lucas Mendes', requestedAt: '2024-03-01', status: 'pending', message: 'Gostaria de participar para melhorar meu desempenho em cálculo.' },
      { id: '2', userId: '11', userName: 'Ana Clara', requestedAt: '2024-03-02', status: 'pending', message: 'Sou aluna do 3º período e preciso de ajuda.' },
    ],
    studySessions: [
      {
        id: '0',
        title: 'Plantão de Dúvidas Permanente',
        description: 'Sala sempre aberta para tirar dúvidas sobre a matéria. Entre quando precisar!',
        scheduledAt: '2026-04-15T14:00:00',
        duration: 180,
        createdBy: 'Prof. Silva',
        participants: ['1', '2', '3', 'current-user'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
      { id: '1', title: 'Revisão de Integrais', description: 'Sessão para revisar integrais definidas e indefinidas', scheduledAt: '2026-04-15T14:00:00', duration: 120, createdBy: 'Prof. Silva', participants: ['1', '2', '3'], order: 1 },
      { id: '2', title: 'Resolução de Exercícios', description: 'Lista 5 do professor', scheduledAt: '2026-04-18T16:00:00', duration: 90, createdBy: 'Maria Santos', participants: ['2', '3'], order: 2 },
    ],
    totalStudyHours: 450,
    activityLevel: 'high',
    messagesCount: 1250,
    tags: ['cálculo', 'integral', 'derivada'],
    rules: ['Respeitar todos os membros', 'Não compartilhar conteúdo sem autorização', 'Participar ativamente das sessões'],
  },
  {
    id: '2',
    name: 'Programação Web com React',
    description: 'Comunidade para estudantes que estão aprendendo desenvolvimento web com React, Next.js e TypeScript.',
    type: 'community',
    privacy: 'public',
    status: 'active',
    category: 'Programação',
    createdBy: 'Carlos Dev',
    createdAt: '2024-02-01',
    members: [
      { id: '1', name: 'Carlos Dev', role: 'admin', joinedAt: '2024-02-01', studyHours: 85 },
      { id: '2', name: 'Ana Tech', role: 'moderator', joinedAt: '2024-02-02', studyHours: 60 },
      { id: 'current-user', name: 'Você', role: 'member', joinedAt: '2024-02-15', studyHours: 25 },
    ],
    joinRequests: [],
    studySessions: [
      {
        id: '0',
        title: 'Code Review & Pair Programming',
        description: 'Sessão permanente para revisão de código e programação em par. Compartilhe seu código e aprenda!',
        scheduledAt: '2026-04-16T19:00:00',
        duration: 120,
        createdBy: 'Carlos Dev',
        participants: ['1', '2', 'current-user'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 320,
    activityLevel: 'high',
    messagesCount: 890,
    tags: ['react', 'javascript', 'frontend'],
    rules: ['Código limpo e comentado', 'Respeitar prazos', 'Ajudar iniciantes'],
  },
  {
    id: '3',
    name: 'Direito Constitucional',
    description: 'Grupo de estudos focado em preparação para concursos e OAB com ênfase em Direito Constitucional.',
    type: 'community',
    privacy: 'invite-only',
    status: 'active',
    category: 'Direito',
    inviteCode: 'DIR2024X',
    createdBy: 'Dra. Fernanda',
    createdAt: '2024-01-20',
    members: [
      { id: '1', name: 'Dra. Fernanda', role: 'admin', joinedAt: '2024-01-20', studyHours: 95 },
      { id: 'current-user', name: 'Você', role: 'member', joinedAt: '2024-02-10', studyHours: 30 },
    ],
    maxMembers: 30,
    joinRequests: [
      { id: '1', userId: '10', userName: 'Lucas Mendes', requestedAt: '2024-03-01', status: 'pending' },
    ],
    studySessions: [
      {
        id: '0',
        title: 'Jurisprudência e Casos Práticos',
        description: 'Discussão permanente de jurisprudências relevantes e resolução de casos práticos para OAB e concursos.',
        scheduledAt: '2026-04-17T18:00:00',
        duration: 150,
        createdBy: 'Dra. Fernanda',
        participants: ['1', 'current-user'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 280,
    activityLevel: 'medium',
    messagesCount: 456,
    tags: ['oab', 'concurso', 'constitucional'],
    rules: ['Fontes confiáveis', 'Respeitar opiniões', 'Foco em jurisprudência atualizada'],
  },
  {
    id: '4',
    name: 'Anatomia e Fisiologia',
    description: 'Grupo oficial do curso de Medicina para estudos de anatomia humana com materiais e sessões de revisão.',
    type: 'official',
    privacy: 'private',
    status: 'featured',
    category: 'Medicina',
    createdBy: 'Dr. Roberto',
    createdAt: '2024-01-10',
    members: [
      { id: '1', name: 'Dr. Roberto', role: 'admin', joinedAt: '2024-01-10', studyHours: 150 },
      { id: '2', name: 'Enf. Paula', role: 'moderator', joinedAt: '2024-01-11', studyHours: 80 },
      { id: 'current-user', name: 'Você', role: 'member', joinedAt: '2024-01-20', studyHours: 40 },
    ],
    maxMembers: 40,
    joinRequests: [],
    studySessions: [
      {
        id: '0',
        title: 'Atlas Anatômico Interativo',
        description: 'Estudo permanente com atlas 3D e modelos anatômicos. Explore sistemas do corpo humano a qualquer momento.',
        scheduledAt: '2026-04-15T10:00:00',
        duration: 240,
        createdBy: 'Dr. Roberto',
        participants: ['1', '2', 'current-user'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 680,
    activityLevel: 'high',
    messagesCount: 2100,
    tags: ['medicina', 'anatomia', 'fisiologia'],
    rules: ['Evidências científicas', 'Respeito à ética médica', 'Compartilhar conhecimento'],
  },
  {
    id: '5',
    name: 'Física Quântica Descomplicada',
    description: 'Um espaço para discutir e entender os conceitos de física quântica de forma mais acessível.',
    type: 'community',
    privacy: 'public',
    status: 'active',
    category: 'Física',
    createdBy: 'Einstein Jr.',
    createdAt: '2024-02-15',
    members: [
      { id: '1', name: 'Einstein Jr.', role: 'admin', joinedAt: '2024-02-15', studyHours: 55 },
      { id: 'current-user', name: 'Você', role: 'member', joinedAt: '2024-03-01', studyHours: 12 },
    ],
    joinRequests: [],
    studySessions: [
      {
        id: '0',
        title: 'Experimentos Mentais Quânticos',
        description: 'Discussão permanente de experimentos mentais e paradoxos da física quântica. Gato de Schrödinger e muito mais!',
        scheduledAt: '2026-04-16T15:00:00',
        duration: 90,
        createdBy: 'Einstein Jr.',
        participants: ['1', 'current-user'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 120,
    activityLevel: 'medium',
    messagesCount: 234,
    tags: ['física', 'quântica', 'mecânica'],
    rules: ['Mente aberta', 'Questionar sem medo', 'Simplificar conceitos complexos'],
  },
  {
    id: '6',
    name: 'Engenharia de Software',
    description: 'Grupo inativo - será reativado no próximo semestre. Arquivos e materiais ainda disponíveis.',
    type: 'official',
    privacy: 'private',
    status: 'inactive',
    category: 'Engenharia',
    createdBy: 'Prof. Marcos',
    createdAt: '2023-08-01',
    members: [
      { id: '1', name: 'Prof. Marcos', role: 'admin', joinedAt: '2023-08-01', studyHours: 200 },
      { id: 'current-user', name: 'Você', role: 'member', joinedAt: '2023-08-15', studyHours: 65 },
    ],
    joinRequests: [],
    studySessions: [
      {
        id: '0',
        title: 'Biblioteca de Padrões de Projeto',
        description: 'Repositório permanente de padrões de projeto, boas práticas e arquitetura de software. Consulte sempre!',
        scheduledAt: '2026-04-20T14:00:00',
        duration: 120,
        createdBy: 'Prof. Marcos',
        participants: ['1', 'current-user'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 890,
    activityLevel: 'low',
    messagesCount: 3400,
    tags: ['engenharia', 'software', 'projeto'],
    rules: ['Código documentado', 'Testes obrigatórios', 'SOLID principles'],
  },
]

const PRIVACY_ICONS = {
  public: Globe,
  private: Lock,
  'invite-only': Mail,
}

const ROLE_COLORS: Record<MemberRole, string> = {
  admin: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  moderator: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  member: 'bg-muted text-muted-foreground',
}

// Componente de sessão com drag and drop
interface SortableSessionCardProps {
  session: GroupStudySession
  groupId: string
  onTogglePin: (sessionId: string) => void
}

function SortableSessionCard({ session, groupId, onTogglePin }: SortableSessionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={session.isPinned ? 'border-primary bg-primary/5' : ''}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Drag handle */}
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{session.title}</h3>
                {session.isPermanent && (
                  <Badge variant="secondary" className="text-xs">
                    <Infinity className="w-3 h-3 mr-1" />
                    Permanente
                  </Badge>
                )}
                {session.isPinned && (
                  <Badge variant="default" className="text-xs">
                    <Pin className="w-3 h-3 mr-1" />
                    Fixada
                  </Badge>
                )}
              </div>
              {session.description && (
                <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(session.scheduledAt).toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {session.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {session.participants.length} participantes
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTogglePin(session.id)}
              title={session.isPinned ? 'Desafixar sessão' : 'Fixar sessão'}
            >
              <Pin className={`w-4 h-4 ${session.isPinned ? 'fill-current text-primary' : ''}`} />
            </Button>
            <Button onClick={() => window.location.href = `/organizacao/grupos/${groupId}/sessao/${session.id}`}>
              Participar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [groups, setGroups] = useLocalStorage<StudyGroup[]>('studyhub-groups', MOCK_GROUPS)
  const [copiedCode, setCopiedCode] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Encontrar grupo
  const group = groups.find(g => g.id === groupId)

  // Estado do usuário atual
  const currentMember = group?.members.find(m => m.id === 'current-user')
  const currentRole = currentMember?.role || 'member'
  const isAdmin = currentRole === 'admin'
  const isModerator = currentRole === 'moderator'
  const canManageMembers = hasPermission(currentRole, 'approve_requests') || hasPermission(currentRole, 'remove_members')

  // Funções auxiliares para data/hora
  const getCurrentDate = () => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const getMinDateTime = () => {
    const now = new Date()
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    }
  }

  // Form states
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    date: getCurrentDate(),
    time: getCurrentTime(),
    duration: '60',
    isPermanent: false,
  })

  if (!group) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Grupo não encontrado</h1>
        <Link href="/organizacao/grupos">
          <Button>Voltar para Grupos</Button>
        </Link>
      </div>
    )
  }

  const PrivacyIcon = PRIVACY_ICONS[group.privacy]

  // Copiar código de convite
  const copyInviteCode = () => {
    if (group.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // Aprovar/Rejeitar solicitação
  const handleJoinRequest = (requestId: string, approve: boolean) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        const request = g.joinRequests.find(r => r.id === requestId)
        if (!request) return g

        return {
          ...g,
          joinRequests: g.joinRequests.map(r =>
            r.id === requestId
              ? { ...r, status: approve ? 'approved' : 'rejected' }
              : r
          ),
          members: approve
            ? [...g.members, {
              id: request.userId,
              name: request.userName,
              avatar: request.userAvatar,
              role: 'member' as MemberRole,
              joinedAt: new Date().toISOString(),
              studyHours: 0,
            }]
            : g.members,
        }
      }
      return g
    }))
  }

  // Alterar papel do membro
  const changeMemberRole = (memberId: string, newRole: MemberRole) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map(m =>
            m.id === memberId ? { ...m, role: newRole } : m
          ),
        }
      }
      return g
    }))
  }

  // Remover membro
  const removeMember = (memberId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m.id !== memberId),
        }
      }
      return g
    }))
  }

  // Sair do grupo
  const leaveGroup = () => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m.id !== 'current-user'),
        }
      }
      return g
    }))
    router.push('/organizacao/grupos')
  }

  // Excluir grupo
  const deleteGroup = () => {
    setGroups(groups.filter(g => g.id !== groupId))
    router.push('/organizacao/grupos')
  }

  // Iniciar sessão agora
  const startSessionNow = () => {
    const now = new Date()
    setNewSession({
      ...newSession,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    })
  }

  // Criar sessão de estudo
  const createStudySession = () => {
    // Validar se a data/hora não está no passado
    const scheduledDateTime = new Date(`${newSession.date}T${newSession.time}:00`)
    const now = new Date()

    if (scheduledDateTime < now && !newSession.isPermanent) {
      alert('Não é possível criar uma sessão com data/hora que já passou')
      return
    }

    const session: GroupStudySession = {
      id: Date.now().toString(),
      title: newSession.title,
      description: newSession.description,
      scheduledAt: `${newSession.date}T${newSession.time}:00`,
      duration: parseInt(newSession.duration),
      createdBy: 'Você',
      participants: ['current-user'],
      isPermanent: newSession.isPermanent,
      isPinned: false,
      order: group.studySessions.length,
    }

    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          studySessions: [...g.studySessions, session],
        }
      }
      return g
    }))

    setIsSessionDialogOpen(false)
    setNewSession({
      title: '',
      description: '',
      date: getCurrentDate(),
      time: getCurrentTime(),
      duration: '60',
      isPermanent: false
    })
  }

  // Fixar/desafixar sessão
  const togglePinSession = (sessionId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          studySessions: g.studySessions.map(s =>
            s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
          ),
        }
      }
      return g
    }))
  }

  // Reordenar sessões (drag and drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setGroups(groups.map(g => {
      if (g.id === groupId) {
        const sessions = [...g.studySessions]
        const oldIndex = sessions.findIndex(s => s.id === active.id)
        const newIndex = sessions.findIndex(s => s.id === over.id)

        // Mover sessão
        const [movedSession] = sessions.splice(oldIndex, 1)
        sessions.splice(newIndex, 0, movedSession)

        // Atualizar order de todas as sessões
        const updatedSessions = sessions.map((s, index) => ({
          ...s,
          order: index,
        }))

        return {
          ...g,
          studySessions: updatedSessions,
        }
      }
      return g
    }))
  }

  // Gerar novo código de convite
  const regenerateInviteCode = () => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          inviteCode: generateInviteCode(),
        }
      }
      return g
    }))
  }

  const pendingRequests = group.joinRequests.filter(r => r.status === 'pending')
  const upcomingSessions = group.studySessions
    .filter(s => new Date(s.scheduledAt) > new Date())
    .sort((a, b) => {
      // Sessões fixadas primeiro
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // Se ambas fixadas ou não-fixadas, ordenar por data
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    })

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/organizacao/grupos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Grupos
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {group.status === 'featured' && (
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              )}
              <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
            </div>
            <p className="text-muted-foreground">{group.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant={group.type === 'official' ? 'default' : 'secondary'}>
                {group.type === 'official' ? <Crown className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                {GROUP_TYPE_LABELS[group.type]}
              </Badge>
              <Badge variant="outline">
                <PrivacyIcon className="w-3 h-3 mr-1" />
                {GROUP_PRIVACY_LABELS[group.privacy]}
              </Badge>
              <Badge variant="outline">
                <BookOpen className="w-3 h-3 mr-1" />
                {group.category}
              </Badge>
              {group.status === 'featured' && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  {GROUP_STATUS_LABELS[group.status]}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {group.privacy === 'invite-only' && group.inviteCode && (
                  <DropdownMenuItem onClick={copyInviteCode}>
                    {copiedCode ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedCode ? 'Copiado!' : 'Copiar Código de Convite'}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Configurar Notificações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-amber-600">
                  <Flag className="w-4 h-4 mr-2" />
                  Denunciar Grupo
                </DropdownMenuItem>
                {!isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair do Grupo
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sair do grupo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Você perderá acesso ao conteúdo e precisará solicitar entrada novamente se o grupo for privado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={leaveGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Sair
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Grupo
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir grupo permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Todos os membros serão removidos e o conteúdo será perdido.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{group.members.length}</p>
                <p className="text-sm text-muted-foreground">
                  {group.maxMembers ? `de ${group.maxMembers} membros` : 'membros'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{group.totalStudyHours}h</p>
                <p className="text-sm text-muted-foreground">de estudo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{group.messagesCount}</p>
                <p className="text-sm text-muted-foreground">mensagens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${group.activityLevel === 'high' ? 'bg-green-500/10' :
                group.activityLevel === 'medium' ? 'bg-amber-500/10' : 'bg-muted'
                }`}>
                <TrendingUp className={`w-5 h-5 ${group.activityLevel === 'high' ? 'text-green-600' :
                  group.activityLevel === 'medium' ? 'text-amber-600' : 'text-muted-foreground'
                  }`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{ACTIVITY_LEVEL_LABELS[group.activityLevel]}</p>
                <p className="text-sm text-muted-foreground">atividade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sessions" className="gap-2">
            <Calendar className="w-4 h-4" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            Membros ({group.members.length})
          </TabsTrigger>
          {canManageMembers && pendingRequests.length > 0 && (
            <TabsTrigger value="requests" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Solicitações ({pendingRequests.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="rules" className="gap-2">
            <Shield className="w-4 h-4" />
            Regras
          </TabsTrigger>
        </TabsList>

        {/* Sessões de Estudo */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sessões de Estudo</h2>
            <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  Nova Sessão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Sessão de Estudo</DialogTitle>
                  <DialogDescription>
                    Agende uma sessão para estudar com o grupo
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-title">Título</Label>
                    <Input
                      id="session-title"
                      placeholder="Ex: Revisão para prova"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-desc">Descrição</Label>
                    <Textarea
                      id="session-desc"
                      placeholder="Descreva o que será estudado..."
                      value={newSession.description}
                      onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Data e Horário</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={startSessionNow}
                        className="text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Começar agora
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-date" className="text-sm">Data</Label>
                        <Input
                          id="session-date"
                          type="date"
                          min={getMinDateTime().date}
                          value={newSession.date}
                          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-time" className="text-sm">Horário</Label>
                        <Input
                          id="session-time"
                          type="time"
                          value={newSession.time}
                          onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Duração (minutos)</Label>
                    <Input
                      id="session-duration"
                      type="number"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="session-permanent"
                      checked={newSession.isPermanent}
                      onCheckedChange={(checked) => setNewSession({ ...newSession, isPermanent: checked as boolean })}
                    />
                    <Label
                      htmlFor="session-permanent"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Sessão permanente (não expira automaticamente)
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={createStudySession}
                    disabled={!newSession.title || !newSession.date || !newSession.time}
                  >
                    Criar Sessão
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {upcomingSessions.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={upcomingSessions.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {upcomingSessions.map(session => (
                    <SortableSessionCard
                      key={session.id}
                      session={session}
                      groupId={groupId}
                      onTogglePin={togglePinSession}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium">Nenhuma sessão agendada</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie uma sessão para estudar com o grupo
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Membros */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Membros do Grupo</h2>
            {group.privacy === 'invite-only' && group.inviteCode && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Código:</span>
                <code className="px-2 py-1 bg-muted rounded font-mono text-sm">{group.inviteCode}</code>
                <Button variant="ghost" size="sm" onClick={copyInviteCode}>
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={regenerateInviteCode}>
                    Regenerar
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {group.members
              .sort((a, b) => {
                const roleOrder = { admin: 0, moderator: 1, member: 2 }
                return roleOrder[a.role] - roleOrder[b.role]
              })
              .map(member => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <Badge variant="outline" className={ROLE_COLORS[member.role]}>
                              {member.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                              {member.role === 'moderator' && <Shield className="w-3 h-3 mr-1" />}
                              {MEMBER_ROLE_LABELS[member.role]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span>{member.studyHours}h de estudo</span>
                            <span>Desde {new Date(member.joinedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>

                      {isAdmin && member.id !== 'current-user' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {member.role !== 'admin' && (
                              <DropdownMenuItem onClick={() => changeMemberRole(member.id, 'admin')}>
                                <Crown className="w-4 h-4 mr-2" />
                                Promover a Admin
                              </DropdownMenuItem>
                            )}
                            {member.role !== 'moderator' && (
                              <DropdownMenuItem onClick={() => changeMemberRole(member.id, 'moderator')}>
                                <Shield className="w-4 h-4 mr-2" />
                                {member.role === 'admin' ? 'Rebaixar a Moderador' : 'Promover a Moderador'}
                              </DropdownMenuItem>
                            )}
                            {member.role !== 'member' && (
                              <DropdownMenuItem onClick={() => changeMemberRole(member.id, 'member')}>
                                <Users className="w-4 h-4 mr-2" />
                                Rebaixar a Membro
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => removeMember(member.id)}
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Remover do Grupo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Solicitações */}
        {canManageMembers && (
          <TabsContent value="requests" className="space-y-4">
            <h2 className="text-xl font-semibold">Solicitações de Entrada</h2>

            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map(request => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.userAvatar} />
                            <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{request.userName}</span>
                            <p className="text-sm text-muted-foreground">
                              Solicitou em {new Date(request.requestedAt).toLocaleDateString('pt-BR')}
                            </p>
                            {request.message && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">
                                &quot;{request.message}&quot;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleJoinRequest(request.id, false)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Recusar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleJoinRequest(request.id, true)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UserPlus className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium">Nenhuma solicitação pendente</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Novas solicitações aparecerão aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Regras */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Regras do Grupo</h2>
            {isAdmin && (
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar Regras
              </Button>
            )}
          </div>

          {group.rules && group.rules.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <ol className="space-y-3">
                  {group.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium">Nenhuma regra definida</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isAdmin ? 'Adicione regras para o grupo' : 'Este grupo não possui regras específicas'}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-700">Denunciar Violação</h4>
                  <p className="text-sm text-amber-600/80 mt-1">
                    Se você presenciar alguma violação das regras ou comportamento inadequado, utilize o botão de denúncia no menu do grupo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

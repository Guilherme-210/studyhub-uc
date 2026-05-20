'use client'

import { useState, useMemo } from 'react'
import { useLocalStorage } from '@hooks/use-local-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Search,
  Plus,
  Users,
  Lock,
  Globe,
  Mail,
  Star,
  Clock,
  TrendingUp,
  Filter,
  Crown,
  Shield,
  BookOpen,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  X
} from 'lucide-react'
import {
  StudyGroup,
  GroupType,
  GroupPrivacy,
  GroupStatus,
  GroupCategory,
  GROUP_CATEGORIES,
  GROUP_TYPE_LABELS,
  GROUP_PRIVACY_LABELS,
  GROUP_STATUS_LABELS,
  ACTIVITY_LEVEL_LABELS,
  generateInviteCode,
} from '@/types/groups'
import Link from 'next/link'

// Dados mock para demonstração
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
    ],
    maxMembers: 50,
    joinRequests: [],
    studySessions: [
      {
        id: '0',
        title: 'Plantão de Dúvidas Permanente',
        description: 'Sala sempre aberta para tirar dúvidas sobre a matéria. Entre quando precisar!',
        scheduledAt: '2026-04-15T14:00:00',
        duration: 180,
        createdBy: 'Prof. Silva',
        participants: ['1', '2', '3'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 450,
    activityLevel: 'high',
    messagesCount: 1250,
    tags: ['cálculo', 'integral', 'derivada'],
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
        participants: ['1', '2'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 320,
    activityLevel: 'high',
    messagesCount: 890,
    tags: ['react', 'javascript', 'frontend'],
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
        participants: ['1'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 280,
    activityLevel: 'medium',
    messagesCount: 456,
    tags: ['oab', 'concurso', 'constitucional'],
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
        participants: ['1', '2'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 680,
    activityLevel: 'high',
    messagesCount: 2100,
    tags: ['medicina', 'anatomia', 'fisiologia'],
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
        participants: ['1'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 120,
    activityLevel: 'medium',
    messagesCount: 234,
    tags: ['física', 'quântica', 'mecânica'],
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
        participants: ['1'],
        isPinned: true,
        isPermanent: true,
        order: 0
      },
    ],
    totalStudyHours: 890,
    activityLevel: 'low',
    messagesCount: 3400,
    tags: ['engenharia', 'software', 'projeto'],
  },
]

const PRIVACY_ICONS = {
  public: Globe,
  private: Lock,
  'invite-only': Mail,
}

export default function GruposPage() {
  const [groups, setGroups] = useLocalStorage<StudyGroup[]>('studyhub-groups', MOCK_GROUPS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<GroupType | 'all'>('all')
  const [filterPrivacy, setFilterPrivacy] = useState<GroupPrivacy | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<GroupCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<GroupStatus | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form state para criar grupo
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'community' as GroupType,
    privacy: 'public' as GroupPrivacy,
    category: 'Outros' as GroupCategory,
    maxMembers: '',
    rules: '',
  })

  // Filtrar grupos
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = filterType === 'all' || group.type === filterType
      const matchesPrivacy = filterPrivacy === 'all' || group.privacy === filterPrivacy
      const matchesCategory = filterCategory === 'all' || group.category === filterCategory
      const matchesStatus = filterStatus === 'all' || group.status === filterStatus

      return matchesSearch && matchesType && matchesPrivacy && matchesCategory && matchesStatus
    })
  }, [groups, searchQuery, filterType, filterPrivacy, filterCategory, filterStatus])

  // Grupos por categoria
  const featuredGroups = filteredGroups.filter(g => g.status === 'featured')
  const officialGroups = filteredGroups.filter(g => g.type === 'official' && g.status !== 'featured')
  const communityGroups = filteredGroups.filter(g => g.type === 'community')

  // Criar novo grupo
  const handleCreateGroup = () => {
    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      type: newGroup.type,
      privacy: newGroup.privacy,
      status: 'active',
      category: newGroup.category,
      inviteCode: newGroup.privacy === 'invite-only' ? generateInviteCode() : undefined,
      createdBy: 'Você',
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'current-user',
          name: 'Você',
          role: 'admin',
          joinedAt: new Date().toISOString(),
          studyHours: 0,
        },
      ],
      maxMembers: newGroup.maxMembers ? parseInt(newGroup.maxMembers) : undefined,
      joinRequests: [],
      studySessions: [],
      totalStudyHours: 0,
      activityLevel: 'low',
      messagesCount: 0,
      rules: newGroup.rules ? newGroup.rules.split('\n').filter(r => r.trim()) : undefined,
    }

    setGroups([group, ...groups])
    setIsCreateDialogOpen(false)
    setNewGroup({
      name: '',
      description: '',
      type: 'community',
      privacy: 'public',
      category: 'Outros',
      maxMembers: '',
      rules: '',
    })
  }

  // Copiar código de convite
  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Entrar em grupo público
  const joinPublicGroup = (groupId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: [
            ...g.members,
            {
              id: 'current-user',
              name: 'Você',
              role: 'member',
              joinedAt: new Date().toISOString(),
              studyHours: 0,
            },
          ],
        }
      }
      return g
    }))
  }

  // Solicitar entrada em grupo privado
  const requestJoin = (groupId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          joinRequests: [
            ...g.joinRequests,
            {
              id: Date.now().toString(),
              userId: 'current-user',
              userName: 'Você',
              requestedAt: new Date().toISOString(),
              status: 'pending',
            },
          ],
        }
      }
      return g
    }))
  }

  // Componente de card do grupo
  const GroupCard = ({ group }: { group: StudyGroup }) => {
    const PrivacyIcon = PRIVACY_ICONS[group.privacy]
    const isMember = group.members.some(m => m.id === 'current-user')
    const hasPendingRequest = group.joinRequests.some(r => r.userId === 'current-user' && r.status === 'pending')

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
        {/* Cover/Header */}
        <div className={`h-2 ${group.type === 'official' ? 'bg-linear-to-r from-amber-500 to-orange-500' :
          'bg-linear-to-r from-primary to-primary/70'
          }`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {group.status === 'featured' && (
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                )}
                <CardTitle className="text-lg truncate">{group.name}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">{group.description}</CardDescription>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <Badge variant={group.type === 'official' ? 'default' : 'secondary'} className="text-xs">
              {group.type === 'official' ? <Crown className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
              {GROUP_TYPE_LABELS[group.type]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <PrivacyIcon className="w-3 h-3 mr-1" />
              {GROUP_PRIVACY_LABELS[group.privacy]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              {group.category}
            </Badge>
            {group.status === 'inactive' && (
              <Badge variant="destructive" className="text-xs">
                {GROUP_STATUS_LABELS[group.status]}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3 text-center py-3 bg-muted/50 rounded-lg">
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span className="text-sm font-medium text-foreground">{group.members.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Membros</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm font-medium text-foreground">{group.totalStudyHours}h</span>
              </div>
              <p className="text-xs text-muted-foreground">Estudo</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className={`text-sm font-medium ${group.activityLevel === 'high' ? 'text-green-600' :
                  group.activityLevel === 'medium' ? 'text-amber-600' : 'text-muted-foreground'
                  }`}>
                  {ACTIVITY_LEVEL_LABELS[group.activityLevel]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Atividade</p>
            </div>
          </div>

          {/* Membros preview */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex -space-x-2">
              {group.members.slice(0, 4).map((member, i) => (
                <Avatar key={member.id} className="w-7 h-7 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {group.members.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            {group.maxMembers && (
              <span className="text-xs text-muted-foreground">
                {group.members.length}/{group.maxMembers} vagas
              </span>
            )}
          </div>

          {/* Código de convite */}
          {group.privacy === 'invite-only' && group.inviteCode && isMember && (
            <div className="mt-3 p-2 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono">{group.inviteCode}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyInviteCode(group.inviteCode!)}
              >
                {copiedCode === group.inviteCode ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          {isMember ? (
            <Link href={`/organizacao/grupos/${group.id}`} className="w-full">
              <Button className="w-full gap-2">
                Acessar Grupo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : group.status === 'inactive' ? (
            <Button disabled className="w-full">
              Grupo Inativo
            </Button>
          ) : hasPendingRequest ? (
            <Button disabled variant="secondary" className="w-full">
              Solicitação Pendente
            </Button>
          ) : group.privacy === 'public' ? (
            <Button onClick={() => joinPublicGroup(group.id)} className="w-full gap-2">
              Entrar no Grupo
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : group.privacy === 'private' ? (
            <Button onClick={() => requestJoin(group.id)} variant="secondary" className="w-full gap-2">
              <Lock className="w-4 h-4" />
              Solicitar Entrada
            </Button>
          ) : (
            <Button variant="secondary" className="w-full gap-2">
              <Mail className="w-4 h-4" />
              Código Necessário
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grupos de Estudo</h1>
          <p className="text-muted-foreground mt-1">
            Encontre grupos ou crie o seu próprio para estudar em comunidade
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Criar Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Grupo</DialogTitle>
              <DialogDescription>
                Configure seu grupo de estudos e comece a colaborar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input
                  id="name"
                  placeholder="Ex: Estudos de Cálculo"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o objetivo do grupo..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={newGroup.type}
                    onValueChange={(v: GroupType) => setNewGroup({ ...newGroup, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Comunidade
                        </div>
                      </SelectItem>
                      <SelectItem value="official">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Oficial
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Privacidade</Label>
                  <Select
                    value={newGroup.privacy}
                    onValueChange={(v: GroupPrivacy) => setNewGroup({ ...newGroup, privacy: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Público
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Privado
                        </div>
                      </SelectItem>
                      <SelectItem value="invite-only">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Apenas Convite
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={newGroup.category}
                  onValueChange={(v: GroupCategory) => setNewGroup({ ...newGroup, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Limite de Membros (opcional)</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  placeholder="Ex: 30"
                  value={newGroup.maxMembers}
                  onChange={(e) => setNewGroup({ ...newGroup, maxMembers: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Regras do Grupo (uma por linha)</Label>
                <Textarea
                  id="rules"
                  placeholder="Ex: Respeitar todos os membros&#10;Não fazer spam..."
                  value={newGroup.rules}
                  onChange={(e) => setNewGroup({ ...newGroup, rules: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!newGroup.name.trim() || !newGroup.description.trim()}
              >
                Criar Grupo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar grupos por nome, descrição ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo</Label>
              <Select value={filterType} onValueChange={(v) => setFilterType(v as GroupType | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="official">Oficial</SelectItem>
                  <SelectItem value="community">Comunidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Privacidade</Label>
              <Select value={filterPrivacy} onValueChange={(v) => setFilterPrivacy(v as GroupPrivacy | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="invite-only">Apenas Convite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as GroupCategory | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {GROUP_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as GroupStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="featured">Em Destaque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Tabs de visualização */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Users className="w-4 h-4" />
            Todos ({filteredGroups.length})
          </TabsTrigger>
          <TabsTrigger value="featured" className="gap-2">
            <Star className="w-4 h-4" />
            Destaques ({featuredGroups.length})
          </TabsTrigger>
          <TabsTrigger value="my-groups" className="gap-2">
            <Shield className="w-4 h-4" />
            Meus Grupos
          </TabsTrigger>
          <TabsTrigger value="recommended" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Recomendados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {/* Grupos em Destaque */}
          {featuredGroups.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-semibold">Em Destaque</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </section>
          )}

          {/* Grupos Oficiais */}
          {officialGroups.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-semibold">Grupos Oficiais</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officialGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </section>
          )}

          {/* Comunidades */}
          {communityGroups.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Comunidades</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communityGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </section>
          )}

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Nenhum grupo encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Tente ajustar os filtros ou crie um novo grupo
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          {featuredGroups.length === 0 && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Nenhum grupo em destaque</h3>
              <p className="text-muted-foreground mt-1">
                Os grupos mais ativos aparecem aqui
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-groups">
          {(() => {
            const myGroups = filteredGroups.filter(g => g.members.some(m => m.id === 'current-user'))
            return myGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground">Você ainda não participa de nenhum grupo</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Entre em um grupo existente ou crie o seu próprio
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Grupo
                </Button>
              </div>
            )
          })()}
        </TabsContent>

        <TabsContent value="recommended">
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Grupos recomendados para você</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Baseado nas suas matérias e interesses de estudo
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.filter(g => g.privacy === 'public' && g.status === 'active').slice(0, 6).map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

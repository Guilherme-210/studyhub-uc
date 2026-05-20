'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLocalStorage } from '@hooks/use-local-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Users,
  Clock,
  Play,
  Pause,
  StopCircle,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Reply,
  Copy,
  Pin,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  Settings,
  LogOut,
  CheckCheck,
  Circle,
  X,
  Timer,
  BookOpen,
  Target,
  Calendar,
  Crown,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { StudyGroup, GroupStudySession, ChatMessage } from '@/types/groups'
import { cn } from '@utils'
import Link from 'next/link'

// Mock data
const MOCK_GROUPS: StudyGroup[] = [
  {
    id: '1',
    name: 'Cálculo Avançado - Turma 2024',
    description: 'Grupo oficial da disciplina de Cálculo III',
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
    joinRequests: [],
    studySessions: [
      {
        id: 'session-1',
        title: 'Revisão de Integrais',
        description: 'Sessão para revisar integrais definidas e indefinidas antes da prova',
        scheduledAt: new Date().toISOString(),
        duration: 120,
        createdBy: 'Prof. Silva',
        participants: ['1', '2', '3', 'current-user'],
      },
      {
        id: 'session-2',
        title: 'Resolução de Exercícios - Lista 5',
        description: 'Resolver exercícios da lista 5 do professor',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        duration: 90,
        createdBy: 'Maria Santos',
        participants: ['2', '3'],
      },
    ],
    totalStudyHours: 450,
    activityLevel: 'high',
    messagesCount: 1250,
    rules: [],
  },
]

// Mock messages for session
const MOCK_SESSION_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: '1',
    senderName: 'Prof. Silva',
    content: 'Bem-vindos à sessão de revisão! Vamos começar com integrais por substituição.',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'm2',
    senderId: '2',
    senderName: 'Maria Santos',
    content: 'Professor, pode explicar quando usar substituição trigonométrica?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'm3',
    senderId: '1',
    senderName: 'Prof. Silva',
    content: 'Claro! Usamos substituição trigonométrica quando temos expressões como √(a² - x²), √(a² + x²) ou √(x² - a²).',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'm4',
    senderId: '3',
    senderName: 'João Pedro',
    content: 'Entendi! E para √(a² - x²) usamos x = a·sen(θ), certo?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'm5',
    senderId: '1',
    senderName: 'Prof. Silva',
    content: 'Exatamente! Muito bem, João. Agora vamos resolver um exemplo juntos.',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
]

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

function formatCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function SessionChatPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string
  const sessionId = params.sessionId as string

  const [groups] = useLocalStorage<StudyGroup[]>('studyhub-groups', MOCK_GROUPS)
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    `studyhub-session-${sessionId}-messages`,
    MOCK_SESSION_MESSAGES
  )
  const [messageInput, setMessageInput] = useState('')
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [isSessionActive, setIsSessionActive] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [showParticipants, setShowParticipants] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [pinnedMessage, setPinnedMessage] = useState<ChatMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Find group and session
  const group = groups.find(g => g.id === groupId)
  const session = group?.studySessions.find(s => s.id === sessionId)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isSessionActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSessionActive, isPaused])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get participants info
  const participants = useMemo(() => {
    if (!group || !session) return []
    return session.participants.map(pId => {
      const member = group.members.find(m => m.id === pId)
      return {
        id: pId,
        name: member?.name || 'Desconhecido',
        avatar: member?.avatar,
        role: member?.role || 'member',
        online: true, // Mock
      }
    })
  }, [group, session])

  // Calculate progress
  const totalDurationSeconds = (session?.duration || 60) * 60
  const progressPercent = Math.min((elapsedTime / totalDurationSeconds) * 100, 100)
  const remainingTime = Math.max(totalDurationSeconds - elapsedTime, 0)

  if (!group || !session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sessão não encontrada</h1>
        <Link href={`/organizacao/grupos/${groupId}`}>
          <Button>Voltar para o Grupo</Button>
        </Link>
      </div>
    )
  }

  // Send message
  const sendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'Você',
      content: messageInput.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content,
      } : undefined,
    }

    setMessages([...messages, newMessage])
    setMessageInput('')
    setReplyingTo(null)
  }

  // Add system message
  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'system',
      senderName: 'Sistema',
      content,
      type: 'system',
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, systemMessage])
  }

  // Toggle hand raise
  const toggleHandRaise = () => {
    setHandRaised(!handRaised)
    if (!handRaised) {
      addSystemMessage('Você levantou a mão')
    } else {
      addSystemMessage('Você abaixou a mão')
    }
  }

  // End session
  const endSession = () => {
    setIsSessionActive(false)
    addSystemMessage(`Sessão encerrada. Tempo total: ${formatCountdown(elapsedTime)}`)
  }

  // Leave session
  const leaveSession = () => {
    addSystemMessage('Você saiu da sessão')
    router.push(`/organizacao/grupos/${groupId}`)
  }

  return (
    <TooltipProvider>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Link href={`/organizacao/grupos/${groupId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold">{session.title}</h1>
                  {isSessionActive ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <Circle className="w-2 h-2 fill-current mr-1" />
                      Ao Vivo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Encerrada</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{group.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Timer */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-lg font-mono font-bold">{formatCountdown(elapsedTime)}</p>
                  <p className="text-xs text-muted-foreground">
                    de {formatDuration(session.duration)}
                  </p>
                </div>
              </div>

              {/* Participants count */}
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users className="w-4 h-4" />
                <span>{participants.length}</span>
              </Button>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowParticipants(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    Ver Participantes
                  </DropdownMenuItem>
                  {isSessionActive && (
                    <>
                      <DropdownMenuItem onClick={() => setIsPaused(!isPaused)}>
                        {isPaused ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Retomar Sessão
                          </>
                        ) : (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pausar Sessão
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={endSession} className="text-destructive">
                        <StopCircle className="w-4 h-4 mr-2" />
                        Encerrar Sessão
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={leaveSession} className="text-amber-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da Sessão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress bar */}
          {isSessionActive && (
            <div className="px-4 pb-3">
              <Progress value={progressPercent} className="h-1" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Tempo restante: {formatCountdown(remainingTime)}</span>
                <span>{Math.round(progressPercent)}% concluído</span>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Session info */}
            {session.description && (
              <div className="p-4 bg-muted/50 border-b border-border">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Objetivo da Sessão</p>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pinned message */}
            {pinnedMessage && (
              <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600">Mensagem Fixada</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setPinnedMessage(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm mt-1">{pinnedMessage.content}</p>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {/* Session start message */}
                <div className="text-center py-4">
                  <Badge variant="secondary" className="text-xs">
                    Sessão iniciada em {formatTime(session.scheduledAt)}
                  </Badge>
                </div>

                {messages.map((message, index) => {
                  const isOwn = message.senderId === 'current-user'
                  const isSystem = message.type === 'system'
                  const showAvatar = !isOwn && !isSystem && (
                    index === 0 ||
                    messages[index - 1].senderId !== message.senderId
                  )

                  // System message
                  if (isSystem) {
                    return (
                      <div key={message.id} className="text-center py-2">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {message.content}
                        </span>
                      </div>
                    )
                  }

                  // Get sender role
                  const senderMember = group.members.find(m => m.id === message.senderId)
                  const isAdmin = senderMember?.role === 'admin'
                  const isModerator = senderMember?.role === 'moderator'

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwn && "flex-row-reverse"
                      )}
                    >
                      {!isOwn && (
                        <div className="w-8">
                          {showAvatar && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}

                      <div className={cn(
                        "max-w-[70%] space-y-1",
                        isOwn && "items-end"
                      )}>
                        {showAvatar && !isOwn && (
                          <div className="flex items-center gap-2 ml-1">
                            <span className="text-xs font-medium">
                              {message.senderName}
                            </span>
                            {isAdmin && (
                              <Crown className="w-3 h-3 text-amber-500" />
                            )}
                            {isModerator && (
                              <Shield className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        )}

                        {message.replyTo && (
                          <div className={cn(
                            "text-xs p-2 rounded-lg border-l-2 border-primary/50 bg-muted/50",
                            isOwn ? "text-right" : "text-left"
                          )}>
                            <p className="font-medium text-primary">{message.replyTo.senderName}</p>
                            <p className="text-muted-foreground truncate">{message.replyTo.content}</p>
                          </div>
                        )}

                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2 group relative",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-tr-md"
                              : "bg-muted rounded-tl-md"
                          )}
                        >
                          <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>

                          <div className={cn(
                            "flex items-center gap-1 mt-1",
                            isOwn ? "justify-end" : "justify-start"
                          )}>
                            <span className={cn(
                              "text-xs",
                              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwn && (
                              <CheckCheck className="w-4 h-4 text-primary-foreground/70" />
                            )}
                          </div>

                          {/* Message Actions */}
                          <div className={cn(
                            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
                            isOwn ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"
                          )}>
                            <div className="flex items-center gap-1 bg-background border rounded-lg shadow-sm p-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setReplyingTo(message)}
                                  >
                                    <Reply className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Responder</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setPinnedMessage(message)}
                                  >
                                    <Pin className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Fixar</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => navigator.clipboard.writeText(message.content)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copiar</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Paused overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <Pause className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Sessão Pausada</h3>
                  <Button onClick={() => setIsPaused(false)}>
                    <Play className="w-4 h-4 mr-2" />
                    Retomar Sessão
                  </Button>
                </div>
              </div>
            )}

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2 border-t border-border bg-muted/50">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  <div className="flex items-center gap-2">
                    <Reply className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-primary">{replyingTo.senderName}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {replyingTo.content}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setReplyingTo(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            {isSessionActive ? (
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  {/* Quick actions */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={handRaised ? "default" : "ghost"}
                        size="icon"
                        onClick={toggleHandRaise}
                        className={handRaised ? "bg-amber-500 hover:bg-amber-600" : ""}
                      >
                        <Hand className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {handRaised ? 'Abaixar mão' : 'Levantar mão'}
                    </TooltipContent>
                  </Tooltip>

                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>

                  <Input
                    placeholder="Digite sua mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="flex-1"
                  />

                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>

                  <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-border bg-muted/50 text-center">
                <p className="text-muted-foreground">Esta sessão foi encerrada</p>
                <Link href={`/organizacao/grupos/${groupId}`}>
                  <Button variant="link" className="mt-2">
                    Voltar para o grupo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Participants sidebar */}
          {showParticipants && (
            <div className="w-72 border-l border-border bg-card hidden lg:block">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Participantes ({participants.length})</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowParticipants(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-4 space-y-3">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {participant.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium truncate">
                            {participant.id === 'current-user' ? 'Você' : participant.name}
                          </p>
                          {participant.role === 'admin' && (
                            <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                          )}
                          {participant.role === 'moderator' && (
                            <Shield className="w-3 h-3 text-blue-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {participant.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

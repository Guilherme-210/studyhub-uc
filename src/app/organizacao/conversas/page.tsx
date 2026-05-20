'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@hooks/use-local-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Reply,
  Trash2,
  Edit,
  Copy,
  Users,
  MessageCircle,
  Plus,
  ArrowLeft,
  Check,
  CheckCheck,
  Circle,
  X,
  ChevronLeft,
} from 'lucide-react'
import { Conversation, ChatMessage } from '@/types/groups'
import { cn } from '@utils'
import { MOCK_CONVERSATIONS, MOCK_CONTACTS } from '@/shared/constants'
import Link from 'next/link'

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Ontem'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }
}

function formatLastSeen(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffMinutes < 1) return 'agora mesmo'
  if (diffMinutes < 60) return `há ${diffMinutes} min`
  if (diffMinutes < 60 * 24) return `há ${Math.floor(diffMinutes / 60)}h`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('studyhub-conversations', MOCK_CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all')
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  // Filtrar conversas
  const filteredConversations = useMemo(() => {
    let filtered = conversations

    if (activeTab === 'direct') {
      filtered = filtered.filter(c => c.type === 'direct')
    } else if (activeTab === 'groups') {
      filtered = filtered.filter(c => c.type === 'group' || c.type === 'session')
    }

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [conversations, activeTab, searchQuery])

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages])

  // Selecionar conversa
  const selectConversation = (convId: string) => {
    setSelectedConversation(convId)
    setShowMobileChat(true)
    // Marcar como lida
    setConversations(conversations.map(c =>
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ))
  }

  // Enviar mensagem
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return

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

    setConversations(conversations.map(c => {
      if (c.id === selectedConversation) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: {
            content: newMessage.content,
            senderId: newMessage.senderId,
            senderName: newMessage.senderName,
            timestamp: newMessage.timestamp,
          },
          updatedAt: newMessage.timestamp,
        }
      }
      return c
    }))

    setMessageInput('')
    setReplyingTo(null)
  }

  // Criar nova conversa
  const createNewConversation = () => {
    if (selectedContacts.length === 0) return

    const participants = selectedContacts.map(id => {
      const contact = MOCK_CONTACTS.find(c => c.id === id)
      return {
        id,
        name: contact?.name || '',
        avatar: contact?.avatar,
        online: contact?.online,
      }
    })

    const isGroup = selectedContacts.length > 1
    const name = isGroup
      ? participants.map(p => p.name.split(' ')[0]).join(', ')
      : participants[0].name

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      type: isGroup ? 'group' : 'direct',
      name,
      participants: [
        { id: 'current-user', name: 'Você', online: true },
        ...participants,
      ],
      unreadCount: 0,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setConversations([newConversation, ...conversations])
    setSelectedConversation(newConversation.id)
    setShowMobileChat(true)
    setIsNewConversationOpen(false)
    setSelectedContacts([])
  }

  // Excluir conversa
  const deleteConversation = (convId: string) => {
    setConversations(conversations.filter(c => c.id !== convId))
    if (selectedConversation === convId) {
      setSelectedConversation(null)
      setShowMobileChat(false)
    }
  }

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Conversas</h1>
          <p className="text-muted-foreground">
            {totalUnread > 0 ? `${totalUnread} mensagens não lidas` : 'Todas as mensagens lidas'}
          </p>
        </div>

        <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Conversa</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conversa</DialogTitle>
              <DialogDescription>
                Selecione um ou mais contatos para iniciar uma conversa
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar contatos..." className="pl-9" />
              </div>

              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {MOCK_CONTACTS.map(contact => (
                    <div
                      key={contact.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedContacts.includes(contact.id)
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-accent"
                      )}
                      onClick={() => {
                        setSelectedContacts(prev =>
                          prev.includes(contact.id)
                            ? prev.filter(id => id !== contact.id)
                            : [...prev, contact.id]
                        )
                      }}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                      <Checkbox checked={selectedContacts.includes(contact.id)} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewConversationOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createNewConversation} disabled={selectedContacts.length === 0}>
                Iniciar Conversa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={cn(
          "w-full lg:w-110 border-r border-border flex flex-col",
          showMobileChat && "hidden lg:flex"
        )}>
          {/* Search & Tabs */}
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">Todas</TabsTrigger>
                <TabsTrigger value="direct" className="flex-1">Diretas</TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">Grupos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedConversation === conversation.id
                        ? "bg-primary/10"
                        : "hover:bg-accent"
                    )}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.type === 'group' || conversation.type === 'session'
                            ? <Users className="w-5 h-5" />
                            : conversation.name.charAt(0)
                          }
                        </AvatarFallback>
                      </Avatar>
                      {conversation.type === 'direct' && (
                        conversation.participants.find(p => p.id !== 'current-user')?.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{conversation.name}</p>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.senderId === 'current-user' && (
                            <span className="text-primary">Você: </span>
                          )}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>

                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col",
          !showMobileChat && "hidden lg:flex"
        )}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentConversation.avatar} />
                    <AvatarFallback>
                      {currentConversation.type === 'group' || currentConversation.type === 'session'
                        ? <Users className="w-5 h-5" />
                        : currentConversation.name.charAt(0)
                      }
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{currentConversation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentConversation.type === 'direct' ? (
                        currentConversation.participants.find(p => p.id !== 'current-user')?.online
                          ? 'Online'
                          : `Visto por último ${formatLastSeen(
                            currentConversation.participants.find(p => p.id !== 'current-user')?.lastSeen || ''
                          )}`
                      ) : (
                        `${currentConversation.participants.length} participantes`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {currentConversation.type === 'group' && currentConversation.groupId && (
                    <Link href={`/organizacao/grupos/${currentConversation.groupId}`}>
                      <Button variant="ghost" size="icon">
                        <Info className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Search className="w-4 h-4 mr-2" />
                        Buscar na Conversa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteConversation(currentConversation.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Conversa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {currentConversation.messages.map((message, index) => {
                    const isOwn = message.senderId === 'current-user'
                    const showAvatar = !isOwn && (
                      index === 0 ||
                      currentConversation.messages[index - 1].senderId !== message.senderId
                    )

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
                            <p className="text-xs text-muted-foreground ml-1">
                              {message.senderName}
                            </p>
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
                                {formatMessageTime(message.timestamp)}
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => setReplyingTo(message)}
                                >
                                  <Reply className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Smile className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigator.clipboard.writeText(message.content)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
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
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">Selecione uma conversa</h3>
                <p className="text-muted-foreground mb-4">
                  Escolha uma conversa ao lado ou inicie uma nova
                </p>
                <Button onClick={() => setIsNewConversationOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Conversa
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

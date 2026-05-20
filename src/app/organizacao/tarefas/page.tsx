'use client'

import { useState } from 'react'
import { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTaskCompletion } from '@entities/task/hooks/use-task-queries'
import type { Task, StudyStats } from '@/types/organization'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  MoreVertical,
  CheckSquare,
  Calendar,
  Clock,
  Flag,
  ListTodo,
  CheckCircle2,
  Circle
} from 'lucide-react'
import { format, parseISO, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-500/10' },
  medium: { label: 'Média', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-500/10' },
  high: { label: 'Alta', color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-500/10' },
}

export default function TasksPage() {
  const { data: tasks = [] } = useGetTasks()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const toggleTaskCompletionMutation = useToggleTaskCompletion()
  const [, setStats] = useState<StudyStats>({
    totalPomodoros: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    tasksCompleted: 0,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
    tags: '',
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: '',
    })
    setEditingTask(null)
  }

  const handleSaveTask = () => {
    if (!formData.title) return

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
    }

    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data: payload })
    } else {
      createTaskMutation.mutate(payload)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEditTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      tags: task.tags?.join(', ') || '',
    })
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id)
  }

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    toggleTaskCompletionMutation.mutate({ id, completed: !task.completed })

    if (!task.completed) {
      setStats(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
      }))
    }
  }

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority)
    }

    // Tab filter
    switch (activeTab) {
      case 'today':
        filtered = filtered.filter(t => t.dueDate && isToday(parseISO(t.dueDate)))
        break
      case 'week':
        filtered = filtered.filter(t => t.dueDate && isThisWeek(parseISO(t.dueDate)))
        break
      case 'completed':
        filtered = filtered.filter(t => t.completed)
        break
      case 'pending':
        filtered = filtered.filter(t => !t.completed)
        break
    }

    // Sort: completed last, then by priority and date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  const filteredTasks = getFilteredTasks()
  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = tasks.filter(t => !t.completed).length
  const todayCount = tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)) && !t.completed).length
  const overdueCount = tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !t.completed && !isToday(parseISO(t.dueDate))).length
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const getDueDateLabel = (dueDate: string) => {
    const date = parseISO(dueDate)
    if (isToday(date)) return 'Hoje'
    if (isTomorrow(date)) return 'Amanhã'
    if (isPast(date)) return 'Atrasada'
    return format(date, "d 'de' MMM", { locale: ptBR })
  }

  const getDueDateColor = (dueDate: string, completed: boolean) => {
    if (completed) return 'text-muted-foreground'
    const date = parseISO(dueDate)
    if (isPast(date) && !isToday(date)) return 'text-red-500'
    if (isToday(date)) return 'text-orange-500'
    if (isTomorrow(date)) return 'text-yellow-500'
    return 'text-muted-foreground'
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Tarefas</h1>
          <p className="text-muted-foreground">Gerencie suas tarefas e prazos</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setIsDialogOpen(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ListTodo className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Para Hoje</p>
                <p className="text-2xl font-bold text-foreground">{todayCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Flag className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atrasadas</p>
                <p className="text-2xl font-bold text-foreground">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {tasks.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progresso Geral</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-180px">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <CheckSquare className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {tasks.length === 0 ? 'Nenhuma tarefa ainda' : 'Nenhuma tarefa encontrada'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {tasks.length === 0
              ? 'Crie sua primeira tarefa para começar'
              : 'Tente ajustar sua busca ou filtros'}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Tarefa
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="mt-1 shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-foreground ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={`${priorityConfig[task.priority].bgColor} ${priorityConfig[task.priority].textColor} border-0`}
                          >
                            <Flag className="w-3 h-3 mr-1" />
                            {priorityConfig[task.priority].label}
                          </Badge>
                          {task.dueDate && (
                            <span className={`text-xs flex items-center gap-1 ${getDueDateColor(task.dueDate, task.completed)}`}>
                              <Calendar className="w-3 h-3" />
                              {getDueDateLabel(task.dueDate)}
                            </span>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <>
                              {task.tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{task.tags.length - 3}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            aria-label="Mais opções da tarefa"
                            title="Mais opções"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleComplete(task.id)}>
                            {task.completed ? (
                              <>
                                <Circle className="w-4 h-4 mr-2" />
                                Marcar como pendente
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Marcar como concluída
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Edite os detalhes da tarefa' : 'Adicione uma nova tarefa'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Título</Label>
              <Input
                id="task-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Entregar trabalho de física"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Descrição</Label>
              <Textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes da tarefa..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Data de Entrega</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="task-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ex: matemática, prova, urgente"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTask}>
              {editingTask ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useLocalStorage, useId } from '@/hooks/use-local-storage'
import type { KanbanColumn, KanbanTask } from '@/types/organization'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  GripVertical,
  Calendar,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

const defaultColumns: KanbanColumn[] = [
  { id: 'backlog', title: 'A Fazer', color: '#6b7280', tasks: [] },
  { id: 'in-progress', title: 'Em Progresso', color: '#3b82f6', tasks: [] },
  { id: 'review', title: 'Revisão', color: '#f59e0b', tasks: [] },
  { id: 'done', title: 'Concluído', color: '#22c55e', tasks: [] },
]

const priorityColors = {
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  high: 'bg-red-500/10 text-red-600 border-red-500/20',
}

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export default function KanbanPage() {
  const [columns, setColumns] = useLocalStorage<KanbanColumn[]>('studyhub-kanban', defaultColumns)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)
  const [draggedTask, setDraggedTask] = useState<{ task: KanbanTask; columnId: string } | null>(null)
  const generateId = useId()

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as KanbanTask['priority'],
    dueDate: '',
    tags: '',
  })

  const [columnForm, setColumnForm] = useState({
    title: '',
    color: '#7c3aed',
  })

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: '',
    })
    setEditingTask(null)
  }

  const resetColumnForm = () => {
    setColumnForm({
      title: '',
      color: '#7c3aed',
    })
  }

  const handleAddTask = () => {
    if (!taskForm.title || !selectedColumn) return

    const newTask: KanbanTask = {
      id: generateId(),
      title: taskForm.title,
      description: taskForm.description || undefined,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || undefined,
      tags: taskForm.tags ? taskForm.tags.split(',').map(t => t.trim()) : undefined,
      createdAt: new Date().toISOString(),
    }

    if (editingTask) {
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t =>
          t.id === editingTask.id
            ? { ...newTask, id: editingTask.id, createdAt: editingTask.createdAt }
            : t
        ),
      })))
    } else {
      setColumns(columns.map(col =>
        col.id === selectedColumn
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ))
    }

    setIsTaskDialogOpen(false)
    resetTaskForm()
  }

  const handleEditTask = (task: KanbanTask, columnId: string) => {
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      tags: task.tags?.join(', ') || '',
    })
    setEditingTask(task)
    setSelectedColumn(columnId)
    setIsTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ))
  }

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    const task = columns.find(c => c.id === fromColumnId)?.tasks.find(t => t.id === taskId)
    if (!task) return

    setColumns(columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
      }
      if (col.id === toColumnId) {
        return { ...col, tasks: [...col.tasks, task] }
      }
      return col
    }))
  }

  const handleAddColumn = () => {
    if (!columnForm.title) return

    const newColumn: KanbanColumn = {
      id: generateId(),
      title: columnForm.title,
      color: columnForm.color,
      tasks: [],
    }

    setColumns([...columns, newColumn])
    setIsColumnDialogOpen(false)
    resetColumnForm()
  }

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(c => c.id !== columnId))
  }

  // Drag and drop handlers
  const handleDragStart = (task: KanbanTask, columnId: string) => {
    setDraggedTask({ task, columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (!draggedTask) return
    if (draggedTask.columnId !== columnId) {
      handleMoveTask(draggedTask.task.id, draggedTask.columnId, columnId)
    }
    setDraggedTask(null)
  }

  const getAdjacentColumns = (columnId: string) => {
    const index = columns.findIndex(c => c.id === columnId)
    return {
      prev: index > 0 ? columns[index - 1] : null,
      next: index < columns.length - 1 ? columns[index + 1] : null,
    }
  }

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-1rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban</h1>
          <p className="text-muted-foreground">Gerencie suas tarefas visualmente</p>
        </div>
        <Button onClick={() => setIsColumnDialogOpen(true)} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Nova Coluna
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((column) => (
            <div
              key={column.id}
              className="w-80 flex flex-col bg-muted/30 rounded-xl"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div
                className="p-4 border-b-2 flex items-center justify-between"
                style={{ borderBottomColor: column.color }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="ml-1">
                    {column.tasks.length}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedColumn(column.id)
                        resetTaskForm()
                        setIsTaskDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Tarefa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteColumn(column.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir Coluna
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {column.tasks.map((task) => {
                  const adjacent = getAdjacentColumns(column.id)
                  return (
                    <Card
                      key={task.id}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-foreground text-sm">
                                {task.title}
                              </h4>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditTask(task, column.id)}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  {adjacent.prev && (
                                    <DropdownMenuItem
                                      onClick={() => handleMoveTask(task.id, column.id, adjacent.prev!.id)}
                                    >
                                      <ArrowLeft className="w-4 h-4 mr-2" />
                                      Mover para {adjacent.prev.title}
                                    </DropdownMenuItem>
                                  )}
                                  {adjacent.next && (
                                    <DropdownMenuItem
                                      onClick={() => handleMoveTask(task.id, column.id, adjacent.next!.id)}
                                    >
                                      <ArrowRight className="w-4 h-4 mr-2" />
                                      Mover para {adjacent.next.title}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteTask(task.id, column.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${priorityColors[task.priority]}`}
                              >
                                {priorityLabels[task.priority]}
                              </Badge>
                              {task.dueDate && (
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {format(parseISO(task.dueDate), 'dd/MM')}
                                </div>
                              )}
                            </div>
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Add Task Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => {
                    setSelectedColumn(column.id)
                    resetTaskForm()
                    setIsTaskDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar tarefa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={(open) => {
        setIsTaskDialogOpen(open)
        if (!open) resetTaskForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Edite os detalhes da tarefa' : 'Adicione uma nova tarefa ao quadro'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Título</Label>
              <Input
                id="task-title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Ex: Estudar para prova de física"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Descrição</Label>
              <Textarea
                id="task-description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Detalhes da tarefa..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Prioridade</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) => setTaskForm({ ...taskForm, priority: value as KanbanTask['priority'] })}
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
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="task-tags"
                value={taskForm.tags}
                onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })}
                placeholder="Ex: matemática, prova, urgente"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>
              {editingTask ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Column Dialog */}
      <Dialog open={isColumnDialogOpen} onOpenChange={(open) => {
        setIsColumnDialogOpen(open)
        if (!open) resetColumnForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coluna</DialogTitle>
            <DialogDescription>
              Adicione uma nova coluna ao seu quadro Kanban
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-title">Título</Label>
              <Input
                id="column-title"
                value={columnForm.title}
                onChange={(e) => setColumnForm({ ...columnForm, title: e.target.value })}
                placeholder="Ex: Em Espera"
              />
            </div>
            <div className="grid gap-2">
              <Label>Cor</Label>
              <div className="flex gap-2">
                {['#7c3aed', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#6b7280'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-all ${
                      columnForm.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setColumnForm({ ...columnForm, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColumnDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddColumn}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

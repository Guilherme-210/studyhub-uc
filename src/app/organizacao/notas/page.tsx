'use client'

import { useState } from 'react'
import { useCreateNote, useDeleteNote, useGetNotes, useToggleNotePinned, useUpdateNote } from '@entities/note/hooks/use-note-queries'
import type { Note } from '@/types/organization'
import { Card, CardContent } from '@/components/ui/card'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Edit2,
  MoreVertical,
  StickyNote,
  Grid3X3,
  List
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const noteColors = [
  { value: '#7c3aed', label: 'Roxo' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#22c55e', label: 'Verde' },
  { value: '#f59e0b', label: 'Amarelo' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#6b7280', label: 'Cinza' },
]

export default function NotesPage() {
  const { data: notes = [] } = useGetNotes()
  const createNoteMutation = useCreateNote()
  const updateNoteMutation = useUpdateNote()
  const deleteNoteMutation = useDeleteNote()
  const toggleNotePinnedMutation = useToggleNotePinned()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: '#7c3aed',
    tags: '',
  })

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      color: '#7c3aed',
      tags: '',
    })
    setEditingNote(null)
  }

  const handleSaveNote = () => {
    if (!formData.title && !formData.content) return

    if (editingNote) {
      updateNoteMutation.mutate({
        id: editingNote.id,
        data: {
          title: formData.title || 'Sem título',
          content: formData.content,
          color: formData.color,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
        },
      })
    } else {
      createNoteMutation.mutate({
        title: formData.title || 'Sem título',
        content: formData.content,
        color: formData.color,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
      })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEditNote = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      color: note.color,
      tags: note.tags?.join(', ') || '',
    })
    setEditingNote(note)
    setIsDialogOpen(true)
  }

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id)
  }

  const handleTogglePin = (id: string) => {
    const note = notes.find(n => n.id === id)
    if (!note) return

    toggleNotePinnedMutation.mutate({ id, pinned: !note.pinned })
  }

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap(n => n.tags || []))
  ).sort()

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = searchQuery === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTag = selectedTag === null ||
        note.tags?.includes(selectedTag)

      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      // Pinned first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      // Then by date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  const pinnedNotes = filteredNotes.filter(n => n.pinned)
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notas</h1>
          <p className="text-muted-foreground">Suas anotações e ideias em um só lugar</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setIsDialogOpen(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedTag === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            Todas
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Notes Grid/List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16">
          <StickyNote className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {notes.length === 0 ? 'Nenhuma nota ainda' : 'Nenhuma nota encontrada'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {notes.length === 0
              ? 'Crie sua primeira nota para começar'
              : 'Tente ajustar sua busca ou filtros'}
          </p>
          {notes.length === 0 && (
            <Button onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Nota
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Pin className="w-4 h-4" />
                Fixadas
              </h2>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-3'
              }>
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    viewMode={viewMode}
                    onEdit={() => handleEditNote(note)}
                    onDelete={() => handleDeleteNote(note.id)}
                    onTogglePin={() => handleTogglePin(note.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Notes */}
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Outras
                </h2>
              )}
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-3'
              }>
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    viewMode={viewMode}
                    onEdit={() => handleEditNote(note)}
                    onDelete={() => handleDeleteNote(note.id)}
                    onTogglePin={() => handleTogglePin(note.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-600px">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Editar Nota' : 'Nova Nota'}</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Edite sua nota' : 'Crie uma nova nota'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note-title">Título</Label>
              <Input
                id="note-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título da nota"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note-content">Conteúdo</Label>
              <Textarea
                id="note-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escreva sua nota aqui..."
                className="min-h-200px resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="note-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ex: matemática, fórmulas, prova"
              />
            </div>
            <div className="grid gap-2">
              <Label>Cor</Label>
              <div className="flex gap-2">
                {noteColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full transition-all ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                      }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNote}>
              {editingNote ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NoteCard({
  note,
  viewMode,
  onEdit,
  onDelete,
  onTogglePin,
}: {
  note: Note
  viewMode: 'grid' | 'list'
  onEdit: () => void
  onDelete: () => void
  onTogglePin: () => void
}) {
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className="w-1 self-stretch rounded-full shrink-0"
              style={{ backgroundColor: note.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{note.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {note.content}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {note.pinned && <Pin className="w-4 h-4 text-primary" />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Mais opções da nota"
                        title="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onEdit}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onTogglePin}>
                        {note.pinned ? (
                          <>
                            <PinOff className="w-4 h-4 mr-2" />
                            Desafixar
                          </>
                        ) : (
                          <>
                            <Pin className="w-4 h-4 mr-2" />
                            Fixar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={onDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(note.updatedAt), "d 'de' MMM", { locale: ptBR })}
                </span>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-[10px]">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onEdit}
    >
      <CardContent className="p-4">
        <div
          className="w-full h-1 rounded-full mb-3"
          style={{ backgroundColor: note.color }}
        />
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground truncate flex-1">{note.title}</h3>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {note.pinned && <Pin className="w-4 h-4 text-primary" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Mais opções da nota"
                  title="Mais opções"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTogglePin(); }}>
                  {note.pinned ? (
                    <>
                      <PinOff className="w-4 h-4 mr-2" />
                      Desafixar
                    </>
                  ) : (
                    <>
                      <Pin className="w-4 h-4 mr-2" />
                      Fixar
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-4 mt-2">
          {note.content}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {format(parseISO(note.updatedAt), "d 'de' MMM", { locale: ptBR })}
          </span>
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-1">
              {note.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="secondary" className="text-[10px]">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

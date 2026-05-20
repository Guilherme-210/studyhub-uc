'use client'

import { useState } from 'react'
import { useLocalStorage, useId } from '@/hooks/use-local-storage'
import type { CalendarEvent } from '@/types/organization'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Edit2
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  isToday
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

const eventColors = [
  { value: '#7c3aed', label: 'Roxo' },
  { value: '#2563eb', label: 'Azul' },
  { value: '#16a34a', label: 'Verde' },
  { value: '#dc2626', label: 'Vermelho' },
  { value: '#ea580c', label: 'Laranja' },
  { value: '#0891b2', label: 'Ciano' },
]

const eventTypes = [
  { value: 'class', label: 'Aula' },
  { value: 'exam', label: 'Prova' },
  { value: 'assignment', label: 'Trabalho' },
  { value: 'study', label: 'Estudo' },
  { value: 'other', label: 'Outro' },
]

export default function CalendarPage() {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('studyhub-events', [])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const generateId = useId()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    color: '#7c3aed',
    type: 'study' as CalendarEvent['type'],
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      startTime: '09:00',
      endDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      endTime: '10:00',
      allDay: false,
      color: '#7c3aed',
      type: 'study',
    })
    setEditingEvent(null)
  }

  const handleAddEvent = () => {
    if (!formData.title || !formData.startDate) return

    const startDateTime = formData.allDay
      ? formData.startDate
      : `${formData.startDate}T${formData.startTime}`

    const endDateTime = formData.allDay
      ? formData.endDate || formData.startDate
      : `${formData.endDate || formData.startDate}T${formData.endTime}`

    if (editingEvent) {
      setEvents(events.map(e =>
        e.id === editingEvent.id
          ? {
            ...e,
            title: formData.title,
            description: formData.description,
            startDate: startDateTime,
            endDate: endDateTime,
            allDay: formData.allDay,
            color: formData.color,
            type: formData.type,
          }
          : e
      ))
    } else {
      const newEvent: CalendarEvent = {
        id: generateId(),
        title: formData.title,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        allDay: formData.allDay,
        color: formData.color,
        type: formData.type,
      }
      setEvents([...events, newEvent])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEditEvent = (event: CalendarEvent) => {
    const startDate = event.startDate.split('T')[0]
    const startTime = event.startDate.includes('T') ? event.startDate.split('T')[1] : '09:00'
    const endDate = event.endDate?.split('T')[0] || startDate
    const endTime = event.endDate?.includes('T') ? event.endDate.split('T')[1] : '10:00'

    setFormData({
      title: event.title,
      description: event.description || '',
      startDate,
      startTime,
      endDate,
      endTime,
      allDay: event.allDay,
      color: event.color,
      type: event.type,
    })
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  // Calendar navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => setCurrentMonth(new Date())

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const calendarDays: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    calendarDays.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate)
      return isSameDay(eventDate, date)
    })
  }

  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : []

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
          <p className="text-muted-foreground">Organize seus compromissos e prazos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Edite os detalhes do evento' : 'Adicione um novo evento ao seu calendário'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Prova de Cálculo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes do evento..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="allDay"
                  checked={formData.allDay}
                  onCheckedChange={(checked) => setFormData({ ...formData, allDay: checked })}
                />
                <Label htmlFor="allDay">Dia inteiro</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                {!formData.allDay && (
                  <div className="grid gap-2">
                    <Label>Hora de Início</Label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                {!formData.allDay && (
                  <div className="grid gap-2">
                    <Label>Hora de Término</Label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as CalendarEvent['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Cor</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: formData.color }}
                          />
                          {eventColors.find(c => c.value === formData.color)?.label}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {eventColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvent}>
                {editingEvent ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Calendar Grid */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoje
                </Button>
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const dayIsToday = isToday(day)

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-80px p-1 text-left rounded-lg transition-all
                      ${isCurrentMonth ? 'bg-card' : 'bg-muted/30'}
                      ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-accent'}
                      ${dayIsToday ? 'bg-primary/5' : ''}
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${!isCurrentMonth && 'text-muted-foreground/50'}
                      ${dayIsToday && 'text-primary'}
                    `}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-[10px] px-1 py-0.5 rounded truncate text-white"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-muted-foreground px-1">
                          +{dayEvents.length - 3} mais
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {selectedDate
                ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                : 'Selecione um dia'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted-foreground text-sm">
                Clique em um dia para ver os eventos
              </p>
            ) : selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-sm mb-4">
                  Nenhum evento neste dia
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      startDate: format(selectedDate, 'yyyy-MM-dd'),
                      endDate: format(selectedDate, 'yyyy-MM-dd'),
                    })
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Evento
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border-l-4 bg-accent/30"
                    style={{ borderLeftColor: event.color }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {event.allDay
                            ? 'Dia inteiro'
                            : format(parseISO(event.startDate), 'HH:mm')}
                          <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                            {eventTypes.find(t => t.value === event.type)?.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

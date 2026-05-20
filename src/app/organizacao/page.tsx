'use client'

import { useLocalStorage } from '@/hooks/use-local-storage'
import type { Task, CalendarEvent, Note, PomodoroSession, StudyStats } from '@/types/organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  CheckSquare,
  Clock,
  Flame,
  StickyNote,
  Target,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { format, isToday, parseISO, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function OrganizationDashboard() {
  const [tasks] = useLocalStorage<Task[]>('studyhub-tasks', [])
  const [events] = useLocalStorage<CalendarEvent[]>('studyhub-events', [])
  const [notes] = useLocalStorage<Note[]>('studyhub-notes', [])
  const [sessions] = useLocalStorage<PomodoroSession[]>('studyhub-pomodoro-sessions', [])
  const [stats] = useLocalStorage<StudyStats>('studyhub-stats', {
    totalPomodoros: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    tasksCompleted: 0,
  })

  // Calculate today's stats
  const todayTasks = tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)))
  const completedTodayTasks = todayTasks.filter(t => t.completed)
  const todayProgress = todayTasks.length > 0 
    ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) 
    : 0

  const todayEvents = events.filter(e => isToday(parseISO(e.startDate)))
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5)
  const recentNotes = notes.slice(0, 3)

  const todaySession = sessions.find(s => 
    startOfDay(parseISO(s.date)).getTime() === startOfDay(new Date()).getTime()
  )

  const statCards = [
    {
      title: 'Pomodoros Hoje',
      value: todaySession?.completedPomodoros || 0,
      icon: Clock,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Tarefas Pendentes',
      value: tasks.filter(t => !t.completed).length,
      icon: CheckSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Sequência Atual',
      value: `${stats.currentStreak} dias`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Horas de Estudo',
      value: `${Math.round(stats.totalMinutes / 60)}h`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ]

  const quickActions = [
    { title: 'Nova Tarefa', href: '/organizacao/tarefas', icon: Plus },
    { title: 'Calendário', href: '/organizacao/calendario', icon: Calendar },
    { title: 'Iniciar Pomodoro', href: '/organizacao/pomodoro', icon: Clock },
    { title: 'Nova Nota', href: '/organizacao/notas', icon: StickyNote },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Bom dia! Pronto para estudar?
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground">{action.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Progresso de Hoje
            </CardTitle>
            <CardDescription>
              {completedTodayTasks.length} de {todayTasks.length} tarefas concluídas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={todayProgress} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {todayTasks.length === 0 ? 'Nenhuma tarefa para hoje' : `${todayProgress}% concluído`}
              </span>
              <Link href="/organizacao/tarefas" className="text-primary hover:underline flex items-center gap-1">
                Ver todas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Eventos de Hoje
            </CardTitle>
            <CardDescription>
              {todayEvents.length} evento{todayEvents.length !== 1 ? 's' : ''} programado{todayEvents.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum evento para hoje</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-accent/50">
                    <div 
                      className="w-2 h-8 rounded-full" 
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.allDay ? 'Dia inteiro' : format(parseISO(event.startDate), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/organizacao/calendario">
              <Button variant="ghost" className="w-full mt-4">
                Ver Calendário <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Tarefas Pendentes
            </CardTitle>
            <CardDescription>
              Suas próximas tarefas a concluir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma tarefa pendente</p>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="flex-1 text-foreground truncate">{task.title}</span>
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(task.dueDate), 'dd/MM')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link href="/organizacao/tarefas">
              <Button variant="ghost" className="w-full mt-4">
                Ver Todas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-primary" />
              Notas Recentes
            </CardTitle>
            <CardDescription>
              Suas últimas anotações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma nota criada</p>
            ) : (
              <div className="space-y-2">
                {recentNotes.map((note) => (
                  <div 
                    key={note.id} 
                    className="p-3 rounded-lg border-l-4 bg-accent/30"
                    style={{ borderLeftColor: note.color }}
                  >
                    <p className="font-medium text-foreground truncate">{note.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
            <Link href="/organizacao/notas">
              <Button variant="ghost" className="w-full mt-4">
                Ver Notas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

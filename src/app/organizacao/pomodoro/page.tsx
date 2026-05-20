'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocalStorage } from '@hooks/use-local-storage'
import type { PomodoroSettings, PomodoroSession, StudyStats } from '@/types/organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Coffee,
  Brain,
  Flame,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'
import { format, startOfDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export default function PomodoroPage() {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('studyhub-pomodoro-settings', defaultSettings)
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('studyhub-pomodoro-sessions', [])
  const [stats, setStats] = useLocalStorage<StudyStats>('studyhub-stats', {
    totalPomodoros: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    tasksCompleted: 0,
  })

  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState(settings)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Get duration based on mode
  const getDuration = useCallback((timerMode: TimerMode) => {
    switch (timerMode) {
      case 'work':
        return settings.workDuration * 60
      case 'shortBreak':
        return settings.shortBreakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
    }
  }, [settings])

  // Play notification sound
  const playSound = useCallback(() => {
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [settings.soundEnabled])

  // Update today's session
  const updateTodaySession = useCallback((addedPomodoros: number, addedMinutes: number) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    
    setSessions(prev => {
      const existingIndex = prev.findIndex(s => s.date === today)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          completedPomodoros: updated[existingIndex].completedPomodoros + addedPomodoros,
          totalMinutes: updated[existingIndex].totalMinutes + addedMinutes,
        }
        return updated
      } else {
        return [...prev, {
          id: today,
          date: today,
          completedPomodoros: addedPomodoros,
          totalMinutes: addedMinutes,
        }]
      }
    })

    // Update global stats
    setStats(prev => {
      const lastStudyDate = prev.lastStudyDate
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
      
      let newStreak = prev.currentStreak
      if (lastStudyDate !== today) {
        if (lastStudyDate === yesterday) {
          newStreak = prev.currentStreak + 1
        } else {
          newStreak = 1
        }
      }

      return {
        ...prev,
        totalPomodoros: prev.totalPomodoros + addedPomodoros,
        totalMinutes: prev.totalMinutes + addedMinutes,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastStudyDate: today,
      }
    })
  }, [setSessions, setStats])

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    playSound()
    
    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1
      setCompletedPomodoros(newCompleted)
      updateTodaySession(1, settings.workDuration)

      // Determine next break type
      if (newCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak')
        setTimeLeft(getDuration('longBreak'))
        if (settings.autoStartBreaks) {
          setIsRunning(true)
        } else {
          setIsRunning(false)
        }
      } else {
        setMode('shortBreak')
        setTimeLeft(getDuration('shortBreak'))
        if (settings.autoStartBreaks) {
          setIsRunning(true)
        } else {
          setIsRunning(false)
        }
      }
    } else {
      // Break completed
      setMode('work')
      setTimeLeft(getDuration('work'))
      if (settings.autoStartPomodoros) {
        setIsRunning(true)
      } else {
        setIsRunning(false)
      }
    }
  }, [mode, completedPomodoros, settings, playSound, updateTodaySession, getDuration])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, handleTimerComplete])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress
  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100

  // Control functions
  const toggleTimer = () => setIsRunning(!isRunning)
  
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(mode))
  }

  const skipTimer = () => {
    setIsRunning(false)
    if (mode === 'work') {
      if ((completedPomodoros + 1) % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak')
        setTimeLeft(getDuration('longBreak'))
      } else {
        setMode('shortBreak')
        setTimeLeft(getDuration('shortBreak'))
      }
    } else {
      setMode('work')
      setTimeLeft(getDuration('work'))
    }
  }

  const changeMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(getDuration(newMode))
  }

  const handleSaveSettings = () => {
    setSettings(tempSettings)
    setTimeLeft(tempSettings.workDuration * 60)
    setMode('work')
    setIsRunning(false)
    setIsSettingsOpen(false)
  }

  // Get today's session
  const todaySession = sessions.find(s => s.date === format(new Date(), 'yyyy-MM-dd'))

  // Mode colors
  const modeColors = {
    work: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      ring: 'ring-primary',
      progress: 'bg-primary',
    },
    shortBreak: {
      bg: 'bg-green-500/10',
      text: 'text-green-600',
      ring: 'ring-green-500',
      progress: 'bg-green-500',
    },
    longBreak: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600',
      ring: 'ring-blue-500',
      progress: 'bg-blue-500',
    },
  }

  const currentColors = modeColors[mode]

  return (
    <div className="p-6 lg:p-8">
      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleOv7OJTQo7y2cFx6kLK6qHZZQklxkLPEjlFDTHiZrqmBZlpYbI6vpYlycmZ4lK2hhXRoZHGQo52HdW9nb4OVmI59d3V1gI6WhHt4d3eAi42CfXx5eoGJi4F9fHl6gYiJgH5+fHuBhYeBf399fICEhYB/f35+f4GDgYCAf3+AgYKBgICAf4CBgYGAgIB/gICAgICAgIB/gICAgICAgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pomodoro</h1>
          <p className="text-muted-foreground">Mantenha o foco com a técnica Pomodoro</p>
        </div>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setTempSettings(settings)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do Pomodoro</DialogTitle>
              <DialogDescription>
                Personalize os tempos e comportamentos do timer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Foco (min)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={tempSettings.workDuration}
                    onChange={(e) => setTempSettings({ ...tempSettings, workDuration: parseInt(e.target.value) || 25 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Pausa Curta</Label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={tempSettings.shortBreakDuration}
                    onChange={(e) => setTempSettings({ ...tempSettings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Pausa Longa</Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={tempSettings.longBreakDuration}
                    onChange={(e) => setTempSettings({ ...tempSettings, longBreakDuration: parseInt(e.target.value) || 15 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Pomodoros até pausa longa</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={tempSettings.sessionsUntilLongBreak}
                  onChange={(e) => setTempSettings({ ...tempSettings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-break">Iniciar pausas automaticamente</Label>
                  <Switch
                    id="auto-break"
                    checked={tempSettings.autoStartBreaks}
                    onCheckedChange={(checked) => setTempSettings({ ...tempSettings, autoStartBreaks: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-pomodoro">Iniciar pomodoros automaticamente</Label>
                  <Switch
                    id="auto-pomodoro"
                    checked={tempSettings.autoStartPomodoros}
                    onCheckedChange={(checked) => setTempSettings({ ...tempSettings, autoStartPomodoros: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound">Som de notificação</Label>
                  <Switch
                    id="sound"
                    checked={tempSettings.soundEnabled}
                    onCheckedChange={(checked) => setTempSettings({ ...tempSettings, soundEnabled: checked })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveSettings}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Timer */}
        <Card className={`${currentColors.bg} border-2 ${isRunning ? currentColors.ring : 'border-transparent'} transition-all`}>
          <CardContent className="p-8">
            {/* Mode Tabs */}
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant={mode === 'work' ? 'default' : 'ghost'}
                onClick={() => changeMode('work')}
                className="gap-2"
              >
                <Brain className="w-4 h-4" />
                Foco
              </Button>
              <Button
                variant={mode === 'shortBreak' ? 'default' : 'ghost'}
                onClick={() => changeMode('shortBreak')}
                className="gap-2"
              >
                <Coffee className="w-4 h-4" />
                Pausa Curta
              </Button>
              <Button
                variant={mode === 'longBreak' ? 'default' : 'ghost'}
                onClick={() => changeMode('longBreak')}
                className="gap-2"
              >
                <Coffee className="w-4 h-4" />
                Pausa Longa
              </Button>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className={`text-8xl md:text-9xl font-bold ${currentColors.text} font-mono tracking-tight`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-muted-foreground mt-4 text-lg">
                {mode === 'work' ? 'Hora de focar!' : mode === 'shortBreak' ? 'Relaxe um pouco' : 'Você merece um descanso!'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-2" />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14"
                onClick={resetTimer}
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
              <Button
                size="lg"
                className={`h-14 px-12 text-lg ${mode === 'work' ? '' : mode === 'shortBreak' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={toggleTimer}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-6 h-6 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14"
                onClick={skipTimer}
              >
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>

            {/* Session Progress */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    i < completedPomodoros % settings.sessionsUntilLongBreak
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Hoje
              </CardTitle>
              <CardDescription>
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Pomodoros</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {todaySession?.completedPomodoros || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Minutos de Foco</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {todaySession?.totalMinutes || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Overall Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Estatísticas Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.totalPomodoros}</p>
                  <p className="text-xs text-muted-foreground">Total Pomodoros</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                  <p className="text-2xl font-bold text-green-600">{Math.round(stats.totalMinutes / 60)}h</p>
                  <p className="text-xs text-muted-foreground">Horas de Foco</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Sequência Atual</span>
                </div>
                <span className="text-xl font-bold text-orange-600">
                  {stats.currentStreak} dias
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Maior Sequência</span>
                <span className="font-semibold text-foreground">
                  {stats.longestStreak} dias
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dica Pomodoro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Durante o foco, evite distrações. Anote ideias que surgirem para revisar depois. 
                Use as pausas para se alongar e hidratar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

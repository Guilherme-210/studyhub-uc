'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@utils'
import { ModeToggle } from '@/components/mode-toggle'
import {
  LayoutDashboard,
  Calendar,
  Columns3,
  Timer,
  StickyNote,
  CheckSquare,
  Home,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Users,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { IconButton } from '@mui/material'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/organizacao',
    icon: LayoutDashboard,
  },
  {
    title: 'Calendário',
    href: '/organizacao/calendario',
    icon: Calendar,
  },
  {
    title: 'Kanban',
    href: '/organizacao/kanban',
    icon: Columns3,
  },
  {
    title: 'Pomodoro',
    href: '/organizacao/pomodoro',
    icon: Timer,
  },
  {
    title: 'Notas',
    href: '/organizacao/notas',
    icon: StickyNote,
  },
  {
    title: 'Tarefas',
    href: '/organizacao/tarefas',
    icon: CheckSquare,
  },
  {
    title: 'Grupos de Estudo',
    href: '/organizacao/grupos',
    icon: Users,
  },
  {
    title: 'Conversas',
    href: '/organizacao/conversas',
    icon: MessageCircle,
  },
]

function SidebarContent({ collapsed, onToggle }: { collapsed: boolean; onToggle?: () => void }) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center p-1 border-b border-border">
        <IconButton className="flex items-center justify-center gap-2 rounded-xl bg-primary" aria-label="Voltar ao Início" onClick={() => window.location.href = '/'}>
          <GraduationCap className="w-10 h-10 text-foreground" />
          {!collapsed && (
            <span className="text-xl font-bold text-foreground">StudyHub</span>
          )}
        </IconButton>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary/10 text-primary font-medium",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Home className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Voltar ao Início</span>}
        </Link>
        <Link
          href="/organizacao/configuracoes"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </Link>

        {/* Theme Toggle */}
        <div className={cn(
          "flex items-center px-3 py-2.5",
          collapsed && "justify-center px-2"
        )}>
          <ModeToggle />
        </div>

        {/* Collapse Button - Desktop only */}
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "w-full justify-center mt-2",
              collapsed && "px-2"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span>Recolher</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function OrganizationSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>
    </>
  )
}

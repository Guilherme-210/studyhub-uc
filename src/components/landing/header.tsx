"use client"

import { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { Menu, X, BookOpen } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

const StyledNav = styled.nav`
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  
  &.scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary);
  
  svg {
    width: 32px;
    height: 32px;
  }
`

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: white;
  z-index: 100;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`

const navLinks = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#planos', label: 'Planos' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <StyledNav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button aria-label="Voltar ao Início" onClick={() => window.location.href = '/'}>
              <Logo>
                <BookOpen className="text-primary" />
                <span>StudyHub</span>
              </Logo>
            </Button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />
              <Button
                variant="text"
                sx={{
                  color: 'var(--primary)',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Entrar
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'var(--primary)',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--ring)',
                    boxShadow: 'none',
                  }
                }}
                onClick={() => window.location.href = '/organizacao'}
              >
                Comece Grátis
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      </StyledNav>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={mobileMenuOpen}>
        <div className="flex justify-between items-center mb-8">
          <Button aria-label="Voltar ao Início" onClick={() => window.location.href = '/'}>
            <Logo>
              <BookOpen className="text-primary" />
              <span>StudyHub</span>
            </Logo>
          </Button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex justify-center mb-4">
              <ModeToggle />
            </div>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'var(--primary)',
                color: 'var(--primary)',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Entrar
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'var(--primary)',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
              }}
            >
              Comece Grátis
            </Button>
          </div>
        </nav>
      </MobileMenu>
    </>
  )
}

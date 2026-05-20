"use client"

import styled from 'styled-components'
import { Button } from '@mui/material'
import { ArrowRight, Play, Sparkles, Users, Target } from 'lucide-react'

const HeroContainer = styled.section`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, var(--background) 0%, var(--secondary) 100%);
`

const GradientOrb = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  opacity: 0.1;
  filter: blur(80px);
  
  &.orb-1 {
    top: -200px;
    right: -200px;
  }
  
  &.orb-2 {
    bottom: -200px;
    left: -200px;
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  }
`

const StatsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border);
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
  }
  
  .label {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    text-align: center;
  }
`

const FloatingCard = styled.div`
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: float 6s ease-in-out infinite;
  
  &.card-1 {
    top: 20%;
    right: 5%;
    animation-delay: 0s;
  }
  
  &.card-2 {
    bottom: 30%;
    right: 10%;
    animation-delay: 2s;
  }
  
  &.card-3 {
    top: 40%;
    left: 5%;
    animation-delay: 4s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  @media (max-width: 1024px) {
    display: none;
  }
`

const IconWrapper = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color || 'var(--secondary)'};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$color === 'var(--accent)' ? 'white' : 'var(--primary)'};
  }
`

export default function HeroSection() {
  return (
    <HeroContainer>
      <GradientOrb className="orb-1" />
      <GradientOrb className="orb-2" />

      {/* Floating Cards */}
      <FloatingCard className="card-1">
        <IconWrapper $color="var(--secondary)">
          <Sparkles />
        </IconWrapper>
        <div>
          <p className="font-semibold text-primary text-sm">IA Personalizada</p>
          <p className="text-xs text-muted-foreground">Recomendações inteligentes</p>
        </div>
      </FloatingCard>

      <FloatingCard className="card-2">
        <IconWrapper $color="var(--accent)">
          <Users />
        </IconWrapper>
        <div>
          <p className="font-semibold text-primary text-sm">Grupos de Estudo</p>
          <p className="text-xs text-muted-foreground">Colabore com colegas</p>
        </div>
      </FloatingCard>

      <FloatingCard className="card-3">
        <IconWrapper $color="var(--secondary)">
          <Target />
        </IconWrapper>
        <div>
          <p className="font-semibold text-primary text-sm">Metas Claras</p>
          <p className="text-xs text-muted-foreground">Acompanhe seu progresso</p>
        </div>
      </FloatingCard>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              A plataforma que transforma seus estudos
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Organize, colabore e
            <span className="text-primary"> alcance seus objetivos</span> acadêmicos
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            StudyHub é a plataforma completa para estudantes universitários que querem melhorar
            sua produtividade, criar grupos de estudo e receber reforço acadêmico personalizado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight className="w-5 h-5" />}
              sx={{
                backgroundColor: 'var(--primary)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '12px',
                padding: '14px 32px',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  backgroundColor: 'var(--ring)',
                  boxShadow: '0 6px 30px rgba(124, 58, 237, 0.4)',
                }
              }}
              onClick={() => window.location.href = '/organizacao'}
            >
              Comece Gratuitamente
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Play className="w-5 h-5" />}
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '12px',
                padding: '14px 32px',
                '&:hover': {
                  borderColor: 'var(--primary)',
                  backgroundColor: 'transparent',
                }
              }}
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatsCard>
              <span className="number">50k+</span>
              <span className="label">Estudantes ativos</span>
            </StatsCard>
            <StatsCard>
              <span className="number">1000+</span>
              <span className="label">Grupos de estudo</span>
            </StatsCard>
            <StatsCard>
              <span className="number">85%</span>
              <span className="label">Aumento na produtividade</span>
            </StatsCard>
            <StatsCard>
              <span className="number">4.9</span>
              <span className="label">Avaliação dos usuários</span>
            </StatsCard>
          </div>
        </div>
      </div>
    </HeroContainer>
  )
}

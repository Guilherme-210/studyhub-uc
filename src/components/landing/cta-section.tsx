"use client"

import styled from 'styled-components'
import { Button } from '@mui/material'
import { ArrowRight, Zap } from 'lucide-react'

const SectionContainer = styled.section`
  padding: 6rem 0;
  background: var(--primary);
  position: relative;
  overflow: hidden;
`

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary) 0%, oklch(0.45 0.28 280) 100%);
  opacity: 0.9;
`

const Decoration = styled.div`
  position: absolute;
  border-radius: 50%;
  background: white;
  opacity: 0.05;
  
  &.dec-1 {
    width: 400px;
    height: 400px;
    top: -200px;
    right: -100px;
  }
  
  &.dec-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    left: -100px;
  }
`

export default function CtaSection() {
  return (
    <SectionContainer>
      <GradientOverlay />
      <Decoration className="dec-1" />
      <Decoration className="dec-2" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">
            Junte-se a mais de 50.000 estudantes
          </span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Pronto para transformar seus estudos?
        </h2>
        
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto text-pretty">
          Comece gratuitamente hoje e descubra como o StudyHub pode ajudar você 
          a alcançar seus objetivos acadêmicos.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="contained" 
            size="large"
            endIcon={<ArrowRight className="w-5 h-5" />}
            sx={{ 
              backgroundColor: 'white',
              color: 'var(--primary)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '12px',
              padding: '14px 32px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Criar Conta Gratuita
          </Button>
          <Button 
            variant="outlined"
            size="large"
            sx={{ 
              borderColor: 'white',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '12px',
              padding: '14px 32px',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Saiba Mais
          </Button>
        </div>
      </div>
    </SectionContainer>
  )
}

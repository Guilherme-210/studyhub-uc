"use client"

import styled from 'styled-components'
import { UserPlus, Settings, Rocket } from 'lucide-react'

const SectionContainer = styled.section`
  padding: 6rem 0;
  background: var(--background);
  position: relative;
  overflow: hidden;
`

const StepCard = styled.div`
  position: relative;
  text-align: center;
  padding: 2rem;
`

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
`

const IconWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    width: 48px;
    height: 48px;
    color: var(--primary);
  }
`

const Connector = styled.div`
  position: absolute;
  top: 60px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
  z-index: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const steps = [
  {
    icon: UserPlus,
    number: '1',
    title: 'Crie sua Conta',
    description: 'Cadastre-se gratuitamente em menos de um minuto e configure seu perfil acadêmico.',
  },
  {
    icon: Settings,
    number: '2',
    title: 'Personalize',
    description: 'Adicione suas matérias, defina suas metas e deixe a IA conhecer suas necessidades.',
  },
  {
    icon: Rocket,
    number: '3',
    title: 'Comece a Estudar',
    description: 'Use todas as ferramentas, participe de grupos e veja seu desempenho melhorar.',
  },
]

export default function HowItWorksSection() {
  return (
    <SectionContainer id="como-funciona">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Como Funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Comece em 3 passos simples
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Não perca tempo com configurações complicadas. 
            Nosso processo é rápido e intuitivo.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <StepCard key={index}>
              {index < steps.length - 1 && <Connector />}
              <IconWrapper>
                <step.icon />
              </IconWrapper>
              <StepNumber>{step.number}</StepNumber>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </StepCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}

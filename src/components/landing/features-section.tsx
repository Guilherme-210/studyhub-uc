"use client"

import styled from 'styled-components'
import { 
  Calendar, 
  Users, 
  Brain, 
  BarChart3, 
  Bell, 
  Trophy 
} from 'lucide-react'

const SectionContainer = styled.section`
  padding: 6rem 0;
  background: var(--card);
`

const FeatureCard = styled.div`
  padding: 2rem;
  border-radius: 20px;
  background: var(--background);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: var(--primary);
  }
`

const IconBox = styled.div<{ $variant?: 'primary' | 'accent' | 'warning' }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: ${props => {
    switch(props.$variant) {
      case 'accent': return 'var(--accent)';
      case 'warning': return 'oklch(0.85 0.15 85)';
      default: return 'var(--primary)';
    }
  }};
  
  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`

const features = [
  {
    icon: Calendar,
    title: 'Organização Inteligente',
    description: 'Gerencie suas tarefas, prazos e horários de estudo com um calendário inteligente que se adapta à sua rotina.',
    variant: 'primary' as const,
  },
  {
    icon: Users,
    title: 'Grupos de Estudo',
    description: 'Crie ou participe de grupos de estudo com colegas do mesmo curso e matéria para aprender colaborativamente.',
    variant: 'accent' as const,
  },
  {
    icon: Brain,
    title: 'Reforço com IA',
    description: 'Receba recomendações personalizadas de estudo baseadas nas suas dificuldades e desempenho.',
    variant: 'primary' as const,
  },
  {
    icon: BarChart3,
    title: 'Análise de Desempenho',
    description: 'Acompanhe seu progresso com métricas detalhadas e identifique áreas que precisam de mais atenção.',
    variant: 'warning' as const,
  },
  {
    icon: Bell,
    title: 'Notificações Inteligentes',
    description: 'Receba lembretes personalizados para não perder prazos e manter a consistência nos estudos.',
    variant: 'accent' as const,
  },
  {
    icon: Trophy,
    title: 'Gamificação',
    description: 'Ganhe conquistas, suba de nível e mantenha-se motivado com nosso sistema de recompensas.',
    variant: 'warning' as const,
  },
]

export default function FeaturesSection() {
  return (
    <SectionContainer id="recursos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Recursos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Tudo que você precisa para estudar melhor
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ferramentas poderosas projetadas especificamente para ajudar estudantes 
            universitários a alcançar seu máximo potencial.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <IconBox $variant={feature.variant}>
                <feature.icon />
              </IconBox>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </FeatureCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}

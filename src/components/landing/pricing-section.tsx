"use client"

import styled from 'styled-components'
import { Button, Chip } from '@mui/material'
import { Check, Sparkles } from 'lucide-react'

const SectionContainer = styled.section`
  padding: 6rem 0;
  background: var(--card);
`

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${props => props.$featured ? 'var(--primary)' : 'var(--background)'};
  border-radius: 24px;
  padding: 2.5rem;
  height: 100%;
  border: 1px solid ${props => props.$featured ? 'var(--primary)' : 'var(--border)'};
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.$featured 
      ? '0 30px 60px rgba(124, 58, 237, 0.4)' 
      : '0 20px 40px rgba(0, 0, 0, 0.08)'};
  }
`

const Price = styled.div<{ $featured?: boolean }>`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  
  .currency {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.$featured ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)'};
  }
  
  .amount {
    font-size: 3.5rem;
    font-weight: 700;
    color: ${props => props.$featured ? 'white' : 'var(--foreground)'};
    line-height: 1;
  }
  
  .period {
    font-size: 1rem;
    color: ${props => props.$featured ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)'};
  }
`

const FeatureList = styled.ul<{ $featured?: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex: 1;
  
  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    color: ${props => props.$featured ? 'rgba(255,255,255,0.9)' : 'var(--foreground)'};
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.$featured ? 'white' : 'var(--accent)'};
      flex-shrink: 0;
    }
  }
`

const plans = [
  {
    name: 'Gratuito',
    description: 'Perfeito para começar',
    price: '0',
    period: '/mês',
    features: [
      'Organização básica de estudos',
      'Até 3 grupos de estudo',
      'Calendário de tarefas',
      'Notificações básicas',
      'Acesso ao app mobile',
    ],
    buttonText: 'Começar Grátis',
    featured: false,
  },
  {
    name: 'Premium',
    description: 'Mais popular entre estudantes',
    price: '19,90',
    period: '/mês',
    features: [
      'Tudo do plano Gratuito',
      'Grupos de estudo ilimitados',
      'IA de reforço personalizado',
      'Análise detalhada de desempenho',
      'Gamificação completa',
      'Suporte prioritário',
    ],
    buttonText: 'Assinar Premium',
    featured: true,
  },
  {
    name: 'Institucional',
    description: 'Para universidades',
    price: 'Sob consulta',
    period: '',
    features: [
      'Tudo do plano Premium',
      'Painel administrativo',
      'Integração com sistemas',
      'Relatórios institucionais',
      'API personalizada',
      'Suporte dedicado',
    ],
    buttonText: 'Fale Conosco',
    featured: false,
  },
]

export default function PricingSection() {
  return (
    <SectionContainer id="planos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Planos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Escolha o plano ideal para você
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comece gratuitamente e faça upgrade quando quiser. 
            Sem compromisso, cancele a qualquer momento.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} $featured={plan.featured}>
              {plan.featured && (
                <Chip
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Mais Popular"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'var(--primary)',
                    }
                  }}
                />
              )}
              <div>
                <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>
              <Price $featured={plan.featured}>
                {plan.price !== 'Sob consulta' && <span className="currency">R$</span>}
                <span className="amount">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </Price>
              <FeatureList $featured={plan.featured}>
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Check />
                    {feature}
                  </li>
                ))}
              </FeatureList>
              <Button 
                variant={plan.featured ? 'contained' : 'outlined'}
                fullWidth
                size="large"
                sx={{
                  backgroundColor: plan.featured ? 'white' : 'transparent',
                  color: plan.featured ? 'var(--primary)' : 'var(--primary)',
                  borderColor: plan.featured ? 'white' : 'var(--primary)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  padding: '12px',
                  '&:hover': {
                    backgroundColor: plan.featured ? 'rgba(255,255,255,0.9)' : 'var(--secondary)',
                    borderColor: plan.featured ? 'white' : 'var(--primary)',
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </PricingCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}

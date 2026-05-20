"use client"

import styled from 'styled-components'
import { Star, Quote } from 'lucide-react'
import { Avatar } from '@mui/material'

const SectionContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, var(--secondary) 0%, var(--background) 100%);
`

const TestimonialCard = styled.div`
  background: var(--card);
  border-radius: 20px;
  padding: 2rem;
  height: 100%;
  border: 1px solid var(--border);
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
`

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: var(--primary);
  opacity: 0.2;
  
  svg {
    width: 40px;
    height: 40px;
  }
`

const StarContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  
  svg {
    width: 18px;
    height: 18px;
    color: oklch(0.8 0.18 85);
    fill: oklch(0.8 0.18 85);
  }
`

const testimonials = [
  {
    name: 'Mariana Santos',
    course: 'Engenharia de Software',
    university: 'USP',
    avatar: 'MS',
    rating: 5,
    text: 'O StudyHub transformou completamente minha forma de estudar. Minha produtividade aumentou muito e consigo acompanhar todas as matérias sem estresse.',
  },
  {
    name: 'Lucas Oliveira',
    course: 'Medicina',
    university: 'UNICAMP',
    avatar: 'LO',
    rating: 5,
    text: 'Os grupos de estudo são incríveis! Consegui encontrar colegas para estudar anatomia e isso fez toda a diferença nas minhas notas.',
  },
  {
    name: 'Ana Carolina Silva',
    course: 'Direito',
    university: 'PUC-SP',
    avatar: 'AS',
    rating: 5,
    text: 'A IA de recomendação é sensacional. Ela entende minhas dificuldades e sugere exatamente o conteúdo que preciso revisar.',
  },
  {
    name: 'Pedro Henrique Costa',
    course: 'Administração',
    university: 'FGV',
    avatar: 'PC',
    rating: 5,
    text: 'Antes eu esquecia dos prazos constantemente. Agora com as notificações inteligentes, nunca mais perdi uma entrega.',
  },
  {
    name: 'Juliana Mendes',
    course: 'Arquitetura',
    university: 'UFMG',
    avatar: 'JM',
    rating: 5,
    text: 'O sistema de gamificação me mantém motivada! É muito bom ver meu progresso e ganhar conquistas.',
  },
  {
    name: 'Rafael Almeida',
    course: 'Ciências da Computação',
    university: 'UFRJ',
    avatar: 'RA',
    rating: 5,
    text: 'Recomendo para todos os universitários. A plataforma é muito intuitiva e realmente ajuda a organizar os estudos.',
  },
]

export default function TestimonialsSection() {
  return (
    <SectionContainer id="depoimentos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            O que nossos estudantes dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Milhares de estudantes já transformaram sua forma de estudar. 
            Veja o que eles têm a dizer.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index}>
              <QuoteIcon>
                <Quote />
              </QuoteIcon>
              <StarContainer>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} />
                ))}
              </StarContainer>
              <p className="text-foreground mb-6 leading-relaxed">
                {`"${testimonial.text}"`}
              </p>
              <div className="flex items-center gap-3">
                <Avatar 
                  sx={{ 
                    bgcolor: 'var(--primary)',
                    width: 48,
                    height: 48,
                  }}
                >
                  {testimonial.avatar}
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.course} - {testimonial.university}
                  </p>
                </div>
              </div>
            </TestimonialCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}

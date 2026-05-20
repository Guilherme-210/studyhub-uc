"use client"

import Link from 'next/link'
import styled from 'styled-components'
import { BookOpen, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import { IconButton } from '@mui/material'

const FooterContainer = styled.footer`
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: 4rem 0 2rem;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--footer-text);
  
  svg {
    width: 32px;
    height: 32px;
  }
`

const FooterLink = styled(Link)`
  color: var(--footer-text-muted);
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--footer-text);
  }
`

const footerLinks = {
  produto: [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Planos', href: '#planos' },
    { label: 'Download App', href: '#' },
    { label: 'Novidades', href: '#' },
  ],
  empresa: [
    { label: 'Sobre Nós', href: '#' },
    { label: 'Carreiras', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Imprensa', href: '#' },
  ],
  suporte: [
    { label: 'Central de Ajuda', href: '#' },
    { label: 'Contato', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Comunidade', href: '#' },
  ],
  legal: [
    { label: 'Privacidade', href: '#' },
    { label: 'Termos de Uso', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Licenças', href: '#' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <FooterContainer>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Logo>
              <BookOpen />
              <span>StudyHub</span>
            </Logo>
            <p className="mt-4 mb-6 max-w-sm" style={{ color: 'var(--footer-text-muted)' }}>
              A plataforma completa para estudantes universitários organizarem seus estudos e alcançarem o sucesso acadêmico.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  aria-label={social.label}
                  sx={{
                    color: 'var(--footer-text-muted)',
                    '&:hover': {
                      color: 'var(--footer-text)',
                      backgroundColor: 'oklch(from var(--footer-text) l c h / 0.1)',
                    }
                  }}
                >
                  <social.icon className="w-5 h-5" />
                </IconButton>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Produto</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.produto.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Empresa</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Suporte</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.suporte.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Legal</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'oklch(from var(--footer-text) l c h / 0.1)' }}>
          <p className="text-sm" style={{ color: 'var(--footer-text-muted)' }}>
            {`© ${new Date().getFullYear()} StudyHub. Todos os direitos reservados.`}
          </p>
          <p className="text-sm" style={{ color: 'var(--footer-text-muted)' }}>
            Feito com dedicacao pela equipe StudyHub
          </p>
        </div>
      </div>
    </FooterContainer>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider as NextThemeProvider } from '@components/theme-provider'
import QueryProvider from '@components/query-provider'
import { ThemeProvider as MuiThemeProvider, StyledComponentsRegistry, AuthProvider } from '@features'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'StudyHub - Sua Plataforma de Estudos Universitários',
  description: 'Organize seus estudos, crie grupos colaborativos e receba reforço acadêmico personalizado. A plataforma completa para estudantes universitários.',
  keywords: ['estudos', 'universidade', 'grupos de estudo', 'produtividade', 'aprendizado', 'educação'],
  authors: [{ name: 'StudyHub Team' }],
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7c3aed',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background" suppressHydrationWarning data-lt-installed="true">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StyledComponentsRegistry>
            <MuiThemeProvider>
              <AuthProvider>
                <QueryProvider>
                  {children}
                </QueryProvider>
              </AuthProvider>
            </MuiThemeProvider>
          </StyledComponentsRegistry>
        </NextThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import { ThemeProvider, StyledComponentsRegistry } from '@/features/theme'
import LandingPage from '@/components/landing/landing-page'

export default function Home() {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <LandingPage />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}

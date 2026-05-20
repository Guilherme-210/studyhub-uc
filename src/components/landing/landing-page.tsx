'use client'

import dynamic from 'next/dynamic'

const Header = dynamic(() => import('@/components/landing/header'), { ssr: false })
const HeroSection = dynamic(() => import('@/components/landing/hero-section'), { ssr: false })
const FeaturesSection = dynamic(() => import('@/components/landing/features-section'), { ssr: false })
const HowItWorksSection = dynamic(() => import('@/components/landing/how-it-works-section'), { ssr: false })
const TestimonialsSection = dynamic(() => import('@/components/landing/testimonials-section'), { ssr: false })
const PricingSection = dynamic(() => import('@/components/landing/pricing-section'), { ssr: false })
const CtaSection = dynamic(() => import('@/components/landing/cta-section'), { ssr: false })
const Footer = dynamic(() => import('@/components/landing/footer'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

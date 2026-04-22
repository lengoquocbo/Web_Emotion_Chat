import LandingCtaSection from '@/components/landing/LandingCtaSection'
import LandingExperienceSection from '@/components/landing/LandingExperienceSection'
import LandingFeatureSection from '@/components/landing/LandingFeatureSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingHeader from '@/components/landing/LandingHeader'
import LandingHeroSection from '@/components/landing/LandingHeroSection'
import LandingInsightsSection from '@/components/landing/LandingInsightsSection'
import { FloatingOrb } from '@/components/landing/LandingShared'
import LandingTestimonialsSection from '@/components/landing/LandingTestimonialsSection'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth/useAuth'

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }


  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc] text-slate-900">
      <div className="relative isolate">
        <FloatingOrb className="left-[-60px] top-[100px] bg-sky-200/60" delay={0.3} size={220} />
        <FloatingOrb className="right-[-40px] top-[280px] bg-violet-200/60" delay={0.9} size={260} />
        <FloatingOrb className="left-[38%] top-[760px] bg-fuchsia-200/50" delay={0.5} size={200} />

        <LandingHeader />

        <main>
          <LandingHeroSection />
          <LandingFeatureSection />
          <LandingInsightsSection />
          <LandingExperienceSection />
          <LandingTestimonialsSection />
          <LandingCtaSection />
        </main>

        <LandingFooter />
      </div>
    </div>
  )
}

import CommunityStories from '@/components/home/CommunityStories'
import HomeHeader from '@/components/home/HomeHeader'
import HomeHero from '@/components/home/HomeHero'
import HomeRightPanel from '@/components/home/HomeRightPanel'

const HomePage = () => (
  <div className="space-y-8">
    <HomeHeader />
    <HomeHero />

    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_320px]">
      <CommunityStories />
      <HomeRightPanel />
    </section>
  </div>
)

export default HomePage

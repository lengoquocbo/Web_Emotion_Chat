import HomeBannerShowcase from '@/components/home/HomeBannerShowcase'
import HomeHeader from '@/components/home/HomeHeader'

const HomePage = () => (
  <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
    <HomeHeader />
    <HomeBannerShowcase />
  </div>
)

export default HomePage

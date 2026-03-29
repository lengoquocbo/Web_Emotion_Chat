import ProfileActionsCard from '@/components/profile/ProfileActionsCard'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileMyStories from '@/components/profile/ProfileMyStories'
import ProfileOverviewCard from '@/components/profile/ProfileOverviewCard'
import ProfileStatsGrid from '@/components/profile/ProfileStatsGrid'
import ProfileWellnessCard from '@/components/profile/ProfileWellnessCard'

const ProfilePage = () => (
  <div className="space-y-6">
    <ProfileHeader />

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
      <div className="space-y-6">
        <ProfileOverviewCard />
        <ProfileStatsGrid />
        <ProfileMyStories />
      </div>

      <div className="space-y-6">
        <ProfileWellnessCard />
        <ProfileActionsCard />
      </div>
    </div>
  </div>
)

export default ProfilePage

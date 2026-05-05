import ProfileActionsCard from '@/components/profile/ProfileActionsCard'
import ProfileAchievementsCard from '@/components/profile/ProfileAchievementsCard'
import ProfileFriendsCard from '@/components/profile/ProfileFriendsCard'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileMyStories from '@/components/profile/ProfileMyStories'
import ProfileOverviewCard from '@/components/profile/ProfileOverviewCard'
import ProfileStatsGrid from '@/components/profile/ProfileStatsGrid'
import ProfileWellnessCard from '@/components/profile/ProfileWellnessCard'

const ProfilePage = () => (
  <div className="flex min-w-0 flex-col gap-5">
    <ProfileHeader />

    <div className="space-y-5">
      <ProfileOverviewCard />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.9fr)]">
        <ProfileFriendsCard />

        <div className="min-w-0 space-y-5">
          <ProfileAchievementsCard />
          <ProfileStatsGrid />
        </div>
      </div>
    </div>

    <ProfileMyStories />
    <ProfileWellnessCard />
    <ProfileActionsCard />
  </div>
)

export default ProfilePage

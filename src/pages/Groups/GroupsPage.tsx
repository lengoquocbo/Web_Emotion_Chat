import GroupComposer from '@/components/groups/GroupComposer'
import GroupHeader from '@/components/groups/GroupHeader'
import GroupMembersPanel from '@/components/groups/GroupMembersPanel'
import GroupThread from '@/components/groups/GroupThread'
import GroupTopicBar from '@/components/groups/GroupTopicBar'

const GroupsPage = () => (
  <section className="h-screen overflow-hidden">
    <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-h-0 flex flex-col">
        <div className="shrink-0">
          <GroupHeader />
        </div>

        <div className="shrink-0 mt-6">
          <GroupTopicBar />
        </div>

        <div className="min-h-0 flex-1 mt-6 overflow-y-auto">
          <GroupThread />
        </div>

        <div className="shrink-0 mt-6">
          <GroupComposer />
        </div>
      </div>

      <aside className="min-h-0 overflow-y-auto">
        <GroupMembersPanel />
      </aside>
    </div>
  </section>
)

export default GroupsPage
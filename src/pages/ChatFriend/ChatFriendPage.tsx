import FriendChatComposer from '@/components/chat-friend/FriendChatComposer'
import FriendChatHeader from '@/components/chat-friend/FriendChatHeader'
import FriendChatSidebar from '@/components/chat-friend/FriendChatSidebar'
import FriendConversation from '@/components/chat-friend/FriendConversation'

const ChatFriendPage = () => (
  <section className="h-screen overflow-hidden">
    <div className="grid h-full xl:grid-cols-[400px_minmax(0,1fr)]">
        <FriendChatSidebar />
      <main className=" flex h-full flex-col overflow-y-auto rounded-[2rem] bg-white/92 p-6 ">
        <div className=" h-50 shrink-0 ">
          <FriendChatHeader />
        </div>

        <div className="min-h-0 w-full bg-white/92 flex-1 overflow-y-auto mt-2 rounded-[2rem]">
          <FriendConversation />
        </div>

        <div className="shrink-0 mt-6">
          <FriendChatComposer />
        </div>
      </main>
    </div>
  </section>
)

export default ChatFriendPage
import FriendChatComposer from '@/components/chat-friend/FriendChatComposer'
import FriendChatHeader from '@/components/chat-friend/FriendChatHeader'
import FriendChatSidebar from '@/components/chat-friend/FriendChatSidebar'
import FriendConversation from '@/components/chat-friend/FriendConversation'

const ChatFriendPage = () => (
  <section className="h-screen overflow-hidden">
    <div className="grid h-full gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <FriendChatSidebar />
   

      <main className="min-h-0 flex flex-col">
        <div className="shrink-0">
          <FriendChatHeader />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto mt-6">
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
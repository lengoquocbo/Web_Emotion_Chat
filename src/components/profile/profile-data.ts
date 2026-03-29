export const weeklyStats = [
  { label: 'Current Streak', value: '12 Days', tone: 'bg-sky-50 text-sky-800' },
  { label: 'Check-ins This Week', value: '5', tone: 'bg-emerald-50 text-emerald-800' },
  { label: 'Support Circles', value: '3', tone: 'bg-fuchsia-50 text-fuchsia-800' },
  { label: 'Calm Score', value: '84%', tone: 'bg-amber-50 text-amber-800' },
] as const

export const wellnessItems = [
  'Morning breathing ritual at 7:30 AM',
  'Gentle reminder to journal after work',
  'Weekly reflection every Sunday evening',
] as const

export const settingsItems = [
  { label: 'Notifications', value: 'Gentle only' },
  { label: 'Privacy Mode', value: 'Enabled' },
  { label: 'AI Companion Tone', value: 'Calm & supportive' },
] as const

export const myStories = [
  {
    id: 'story-1',
    title: 'Morning Reset',
    excerpt:
      'I finally gave myself permission to start the day slowly. Ten mindful breaths changed the tone of everything after.',
    category: 'Mindfulness',
    time: 'Posted 2 hours ago',
    likes: 124,
    comments: 12,
    tone: 'bg-sky-50 text-sky-800',
  },
  {
    id: 'story-2',
    title: 'A kinder work break',
    excerpt:
      'Instead of doom-scrolling between tasks, I walked away from my laptop for five minutes and came back lighter.',
    category: 'Growth',
    time: 'Posted yesterday',
    likes: 89,
    comments: 7,
    tone: 'bg-emerald-50 text-emerald-800',
  },
  {
    id: 'story-3',
    title: 'Learning to ask for space',
    excerpt:
      'Today I told a friend I needed quiet before replying. It felt uncomfortable, but also deeply respectful to myself.',
    category: 'Boundaries',
    time: 'Posted 3 days ago',
    likes: 203,
    comments: 18,
    tone: 'bg-fuchsia-50 text-fuchsia-800',
  },
] as const

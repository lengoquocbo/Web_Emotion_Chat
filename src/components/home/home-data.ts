export const storyTags = ['Peaceful', 'Tired', 'Hopeful', 'Overwhelmed', 'Grateful']

export const circles = [
  {
    name: 'Anxiety Release',
    stats: '1.2k active souls',
    initials: 'AN',
    tone: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Deep Sleep Club',
    stats: '850 active souls',
    initials: 'DS',
    tone: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Writing for Healing',
    stats: '3.4k active souls',
    initials: 'WH',
    tone: 'bg-sky-100 text-sky-700',
  },
]

export const stories = [
  {
    author: 'Sarah Mitchell',
    initials: 'SM',
    meta: '2 hours ago - Mindfulness',
    avatarTone: 'from-orange-100 via-rose-100 to-indigo-100',
    content:
      'Today I finally mastered the 5-minute morning meditation. It feels like such a small thing, but my focus at work has completely shifted. Highly recommend starting small.',
    image: true,
    likes: 124,
    comments: 12,
    saved: true,
  },
  {
    author: 'David Chen',
    initials: 'DC',
    meta: '5 hours ago - Growth',
    avatarTone: 'from-emerald-100 via-lime-50 to-cyan-100',
    quote:
      '"Healing is not linear, and that is okay. Some days are for running, and some days are for simply breathing."',
    likes: 342,
    comments: 48,
    saved: false,
    liked: true,
    shared: true,
  },
] as const

export const weeklyGrowth = [42, 58, 36, 74, 50, 28, 22]

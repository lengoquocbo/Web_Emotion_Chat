export const friendThreads = [
  {
    name: 'Linh Nguyen',
    initials: 'LN',
    preview: 'I made it through the afternoon. Want to call later?',
    time: '2m ago',
    active: true,
    unread: 2,
    tone: 'from-fuchsia-100 via-rose-50 to-orange-100',
  },
  {
    name: 'Minh Tran',
    initials: 'MT',
    preview: 'That breathing trick actually helped a lot.',
    time: '18m ago',
    active: false,
    unread: 0,
    tone: 'from-sky-100 via-cyan-50 to-emerald-100',
  },
  {
    name: 'Annie',
    initials: 'AN',
    preview: 'Sending you a grounding playlist.',
    time: '1h ago',
    active: false,
    unread: 0,
    tone: 'from-amber-100 via-yellow-50 to-orange-100',
  },
  {
    name: 'Bao',
    initials: 'BA',
    preview: 'Proud of you for slowing down today.',
    time: '3h ago',
    active: false,
    unread: 0,
    tone: 'from-violet-100 via-fuchsia-50 to-pink-100',
  },
] as const

export const friendMessages = [
  {
    id: '1',
    role: 'friend',
    time: '10:12 AM',
    text: 'Hey, how are you holding up today? You sounded a little drained earlier.',
  },
  {
    id: '2',
    role: 'self',
    time: '10:14 AM',
    text: "A bit overwhelmed, honestly. I'm trying to stay calm but my brain keeps racing.",
  },
  {
    id: '3',
    role: 'friend',
    time: '10:15 AM',
    text: 'That makes sense. Want to vent for a minute, or should we do a tiny reset together?',
  },
  {
    id: '4',
    role: 'self',
    time: '10:17 AM',
    text: 'A tiny reset sounds nice. I think I just need someone to help me slow down.',
  },
  {
    id: '5',
    role: 'friend',
    time: '10:18 AM',
    text: 'Okay. Let’s do three soft breaths. Inhale gently, loosen your shoulders, and only think about the next five minutes.',
  },
] as const

export const quickActions = ['Send reassurance', 'Share playlist', 'Start voice call'] as const

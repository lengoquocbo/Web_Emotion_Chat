export const groupTopics = [
  {
    label: 'Mindfulness',
    tone: 'bg-fuchsia-200/70 text-fuchsia-900',
  },
  {
    label: 'Anxiety Support',
    tone: 'bg-emerald-200/75 text-emerald-900',
  },
  {
    label: '+ Add Topic',
    tone: 'bg-slate-100 text-slate-600',
  },
] as const

export const groupMessages = [
  {
    id: '1',
    author: 'Elena',
    time: '09:42 AM',
    initials: 'EL',
    role: 'member',
    avatarTone: 'from-orange-100 via-rose-50 to-amber-100',
    bubbleTone: 'bg-fuchsia-100/75 text-slate-700',
    text: "Good morning everyone. I'm feeling a bit overwhelmed by my to-do list today. Anyone have a quick centering exercise? 🌿",
  },
  {
    id: '2',
    author: 'Marcus',
    time: '09:44 AM',
    initials: 'MA',
    role: 'member',
    avatarTone: 'from-emerald-100 via-cyan-50 to-sky-100',
    bubbleTone: 'bg-emerald-100/75 text-slate-700',
    text: 'Try the 4-7-8 technique, Elena. Inhale for 4, hold for 7, exhale for 8. It usually resets my nervous system in under a minute.',
  },
  {
    id: '3',
    author: 'You',
    time: '09:45 AM',
    initials: 'AN',
    role: 'self',
    avatarTone: 'from-sky-600 to-sky-700',
    bubbleTone: 'bg-sky-800 text-white',
    text: 'Just tried that with you Marcus. Already feeling the "digital noise" fade away. Thank you for sharing!',
  },
] as const

export const groupMembers = [
  {
    name: 'You (Alex)',
    status: 'Feeling Centered',
    initials: 'AL',
    tone: 'from-orange-100 via-amber-50 to-sky-100',
    online: true,
    strong: true,
  },
  {
    name: 'Elena',
    status: 'Listening...',
    initials: 'EL',
    tone: 'from-orange-100 via-rose-50 to-amber-100',
    online: true,
    strong: false,
  },
  {
    name: 'Marcus',
    status: 'Supporting',
    initials: 'MA',
    tone: 'from-emerald-100 via-cyan-50 to-sky-100',
    online: true,
    strong: false,
  },
  {
    name: 'Sarah',
    status: 'Away',
    initials: 'SA',
    tone: 'from-slate-100 via-zinc-50 to-stone-100',
    online: false,
    strong: false,
  },
] as const

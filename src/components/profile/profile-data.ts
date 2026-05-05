export const weeklyStats = [
  { label: 'Current Streak', value: '12 Days', tone: 'bg-sky-100 text-sky-900 ring-sky-200' },
  { label: 'Check-ins This Week', value: '5', tone: 'bg-emerald-100 text-emerald-900 ring-emerald-200' },
  { label: 'Support Circles', value: '3', tone: 'bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-200' },
  { label: 'Calm Score', value: '84%', tone: 'bg-amber-100 text-amber-900 ring-amber-200' },
] as const

export const friends = [
  {
    id: 'friend-1',
    name: 'Minh Thu',
    handle: 'minhthu@example.com',
    status: 'Checked in 1 hour ago',
    accent: 'from-sky-200 via-cyan-100 to-blue-50',
  },
  {
    id: 'friend-2',
    name: 'Gia Han',
    handle: 'giahan@example.com',
    status: 'Active in 2 support circles',
    accent: 'from-emerald-200 via-teal-100 to-lime-50',
  },
  {
    id: 'friend-3',
    name: 'Bao Tran',
    handle: 'baotran@example.com',
    status: 'Sent a gentle nudge yesterday',
    accent: 'from-fuchsia-200 via-rose-100 to-orange-50',
  },
] as const

export const incomingRequests = [
  {
    id: 'incoming-1',
    name: 'Quynh Anh',
    handle: 'quynhanh@example.com',
    note: 'Wants to connect after a similar check-in journey.',
  },
  {
    id: 'incoming-2',
    name: 'Phuong Linh',
    handle: 'phuonglinh@example.com',
    note: 'Shared overlapping calm and reflection habits.',
  },
] as const

export const outgoingRequests = [
  {
    id: 'outgoing-1',
    name: 'Tuan Kiet',
    handle: 'tuankiet@example.com',
    note: 'Awaiting response',
  },
  {
    id: 'outgoing-2',
    name: 'Ha My',
    handle: 'hamy@example.com',
    note: 'Sent 2 days ago',
  },
] as const

export const otherProfiles = [
  {
    id: 'friend-1',
    displayName: 'Minh Thu',
    email: 'minhthu@example.com',
    phone: '+84 912 300 101',
    initials: 'MT',
  },
  {
    id: 'friend-2',
    displayName: 'Gia Han',
    email: 'giahan@example.com',
    phone: '+84 912 300 202',
    initials: 'GH',
  },
  {
    id: 'friend-3',
    displayName: 'Bao Tran',
    email: 'baotran@example.com',
    phone: '+84 912 300 303',
    initials: 'BT',
  },
  {
    id: 'incoming-1',
    displayName: 'Quynh Anh',
    email: 'quynhanh@example.com',
    phone: '+84 912 300 404',
    initials: 'QA',
  },
  {
    id: 'incoming-2',
    displayName: 'Phuong Linh',
    email: 'phuonglinh@example.com',
    phone: '+84 912 300 505',
    initials: 'PL',
  },
  {
    id: 'outgoing-1',
    displayName: 'Tuan Kiet',
    email: 'tuankiet@example.com',
    phone: '+84 912 300 606',
    initials: 'TK',
  },
] as const

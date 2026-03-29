export const chatMessages = [
  {
    id: '1',
    role: 'assistant',
    time: '10:02 AM',
    text: "Hello there. I'm here to provide a safe space for whatever is on your mind today. How are you feeling in this moment?",
  },
  {
    id: '2',
    role: 'user',
    time: '10:05 AM',
    text: "I've been feeling a bit overwhelmed with work lately. It's hard to find a moment of true peace.",
  },
  {
    id: '3',
    role: 'assistant',
    time: '10:06 AM',
    text: "It sounds like you're carrying a heavy load right now. Remember that it's okay to feel overwhelmed when the demands of life stack up. Would you like to explore some grounding exercises, or do you just need someone to listen while you vent?",
  },
] as const

export const quickPrompts = [
  { label: 'I need advice', active: true },
  { label: 'Just venting', active: false },
  { label: 'Grounding exercise', active: false },
  { label: 'Help me sleep', active: false },
] as const

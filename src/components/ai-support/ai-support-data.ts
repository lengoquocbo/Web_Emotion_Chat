export type AIMessageRole = 'assistant' | 'user'

export type AIMessage = {
  id: string
  role: AIMessageRole
  time: string
  text: string
}

export type AIThread = {
  id: string
  title: string
  preview: string
  updatedAt: string
  messages: AIMessage[]
}

export const quickPrompts = [
  { label: 'Mình đang bị quá tải và cần sắp xếp lại suy nghĩ', active: true },
  { label: 'Hôm nay mình chỉ muốn được lắng nghe', active: false },
  { label: 'Gợi ý cho mình một bài tập thở ngắn', active: false },
  { label: 'Giúp mình viết ra điều đang làm mình lo lắng', active: false },
] as const

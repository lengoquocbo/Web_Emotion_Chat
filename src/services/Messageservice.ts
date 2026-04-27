import axiosClient from '@/services/axiosClient'
import type { Message, PagedResult, EditMessageRequest } from '@/types/Chat'

// Helper: axiosClient interceptor trả response.data
// Nhưng nếu đi qua Vite proxy thì có thể trả full axios object
// → normalize về đúng shape
function unwrap<T>(res: any): T {
  // Nếu là full axios response object (có .data và .status)
  if (res && typeof res === 'object' && 'status' in res && 'data' in res && typeof res.status === 'number') {
    return res.data as T
  }
  return res as T
}

export const getMessagesByRoom = async (
  roomId: string,
  pageNumber = 1,
  pageSize = 30,
): Promise<PagedResult<Message>> => {
  const res = await axiosClient.get(
    `/api/Message/room/${roomId}`,
    { params: { pageNumber, pageSize } },
  )
  return unwrap<PagedResult<Message>>(res)
}

export const searchMessages = async (
  roomId: string,
  keyword: string,
  pageNumber = 1,
  pageSize = 20,
): Promise<PagedResult<Message>> => {
  const res = await axiosClient.get(
    `/api/Message/room/${roomId}/search`,
    { params: { keyword, pageNumber, pageSize } },
  )
  return unwrap<PagedResult<Message>>(res)
}

export const editMessage = async (
  messageId: string,
  data: EditMessageRequest,
): Promise<Message> => {
  const res = await axiosClient.put(`/api/Message/${messageId}`, data)
  return unwrap<Message>(res)
}

export const deleteMessage = (messageId: string): Promise<void> =>
  axiosClient.delete(`/api/Message/${messageId}`)
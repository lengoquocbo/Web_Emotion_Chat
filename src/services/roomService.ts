import axiosClient from '@/services/axiosClient'
import type { Room, RoomMember } from '@/types/Chat'

function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'status' in res && 'data' in res && typeof res.status === 'number') {
    return res.data as T
  }
  return res as T
}

export const getMyRooms = async (): Promise<Room[]> => {
  const res = await axiosClient.get('/api/Room/my')
  return unwrap<Room[]>(res)
}

export const getRoomMembers = async (roomId: string): Promise<RoomMember[]> => {
  const res = await axiosClient.get(`/api/Room/${roomId}/members`)
  return unwrap<RoomMember[]>(res)
}
import { Room, RoomType } from './../types/Chat';
import axiosClient from '@/services/axiosClient'
import type { RoomMember } from '@/types/Chat'
import { ServiceResult } from '@/types/serviceResult';
import { mapAxiosErrorToServiceResult } from './serviceResult';

function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'status' in res && 'data' in res && typeof res.status === 'number') {
    return res.data as T
  }
  return res as T
}

export const getMyRooms = async (roomType: RoomType): Promise<Room[]> => {
  const res = await axiosClient.get(`/api/Room/my`, { params: { roomType } })
  return unwrap<Room[]>(res)
}

export const getRoomMembers = async (roomId: string): Promise<RoomMember[]> => {
  const res = await axiosClient.get(`/api/Room/${roomId}/members`)
  return unwrap<RoomMember[]>(res)
}

export const getOrCreateDirectRoom = async (otherUserId : string) : Promise<ServiceResult<Room>> => {
  try {
    const response = await axiosClient.post(`/api/Room/direct/${otherUserId}`)
    return ServiceResult.ok<Room>(response.data, response.status)
  } catch (error) {
    return mapAxiosErrorToServiceResult<Room>(error, 'Lỗi khi tạo hoặc lấy phòng trò chuyện trực tiếp')
  }
}

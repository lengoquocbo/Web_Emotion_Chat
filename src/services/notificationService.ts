import type { NotificationDto, NotificationType } from '@/types/notification'
import { ServiceResult } from '@/types/serviceResult'

import axiosClient from './axiosClient'
import { mapAxiosErrorToServiceResult } from './serviceResult'

type NotificationApiDto = Partial<NotificationDto> & {
  Id?: string
  UserId?: string
  Type?: NotificationType
  Title?: string
  Body?: string
  PayloadJson?: string | null
  IsRead?: boolean
  CreatedAt?: string
  ReadAt?: string | null
}

function normalizeNotification(payload: NotificationApiDto): NotificationDto {
  return {
    id: payload.id ?? payload.Id ?? '',
    userId: payload.userId ?? payload.UserId ?? '',
    type: payload.type ?? payload.Type ?? 'MessageReceived',
    title: payload.title ?? payload.Title ?? '',
    body: payload.body ?? payload.Body ?? '',
    payloadJson: payload.payloadJson ?? payload.PayloadJson ?? null,
    isRead: payload.isRead ?? payload.IsRead ?? false,
    createdAt: payload.createdAt ?? payload.CreatedAt ?? new Date().toISOString(),
    readAt: payload.readAt ?? payload.ReadAt ?? null,
  }
}

function normalizeNotifications(payload: unknown): NotificationDto[] {
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.map((item) => normalizeNotification((item ?? {}) as NotificationApiDto))
}

export const notificationService = {
  GetMyNotification: async (skip: number, take: number): Promise<ServiceResult<NotificationDto[]>> => {
    try {
      const response = await axiosClient.get<NotificationApiDto[]>('/api/Notification/me', {
        params: { skip, take },
      })

      return ServiceResult.ok(normalizeNotifications(response.data), response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<NotificationDto[]>(error, 'Lỗi khi lấy danh sách notification')
    }
  },

  GetNotificationById: async (notificationId: string): Promise<ServiceResult<NotificationDto>> => {
    try {
      const response = await axiosClient.get<NotificationApiDto>(`/api/Notification/${notificationId}`)
      return ServiceResult.ok(normalizeNotification(response.data), response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<NotificationDto>(error, 'Lỗi khi lấy notification theo ID')
    }
  },

  MarkAsRead: async (notificationId: string): Promise<ServiceResult<void>> => {
    try {
      await axiosClient.post(`/api/Notification/${notificationId}/mark-as-read`)
      return ServiceResult.ok(undefined, 200)
    } catch (error) {
      return mapAxiosErrorToServiceResult<void>(error, 'Lỗi khi đánh dấu notification đã đọc')
    }
  },

  MarkAllAsRead: async (): Promise<ServiceResult<void>> => {
    try {
      await axiosClient.post('/api/Notification/mark-all-as-read')
      return ServiceResult.ok(undefined, 200)
    } catch (error) {
      return mapAxiosErrorToServiceResult<void>(error, 'Lỗi khi đánh dấu tất cả notification đã đọc')
    }
  },

  UnReadCount: async (): Promise<ServiceResult<number>> => {
    try {
      const response = await axiosClient.get<{ unreadCount?: number; UnreadCount?: number }>(
        '/api/Notification/unread-count',
      )

      return ServiceResult.ok(response.data.unreadCount ?? response.data.UnreadCount ?? 0, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<number>(error, 'Lỗi khi lấy số lượng notification chưa đọc')
    }
  },

  GetByType: async (
    type: NotificationType,
    skip: number,
    take: number,
  ): Promise<ServiceResult<NotificationDto[]>> => {
    try {
      const response = await axiosClient.get<NotificationApiDto[]>('/api/Notification/me/notification-type', {
        params: { type, skip, take },
      })

      return ServiceResult.ok(normalizeNotifications(response.data), response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<NotificationDto[]>(
        error,
        'Lỗi khi lấy danh sách notification theo loại',
      )
    }
  },
}

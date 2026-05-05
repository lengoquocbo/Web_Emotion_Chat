import axiosClient from "./axiosClient";
import { mapAxiosErrorToServiceResult } from "./serviceResult";
import { ServiceResult } from "@/types/serviceResult";
import { NotificationDto } from "@/types/notification";

export const notificationService = 
{
    GetMyNotification: async (skip: number, take: number): Promise<ServiceResult<NotificationDto[]>> => {
        try {
            const response = await axiosClient.get<NotificationDto[]>('/api/Notification/me', {
                params: {
                    skip,
                    take
                }
            })
            return ServiceResult.ok(response.data, response.status)
        } catch (error) {
            return mapAxiosErrorToServiceResult<NotificationDto[]>(error, 'Loi khi lay danh sach notification')
        }
    },


    GetNotificationById : async (notificationId: string): Promise<ServiceResult<NotificationDto>> => {
        try {
            const response = await axiosClient.get<NotificationDto>(`/api/Notification/${notificationId}`)
            return ServiceResult.ok(response.data, response.status)
        } catch (error) {
            return mapAxiosErrorToServiceResult<NotificationDto>(error, 'Loi khi lay notification theo ID')
        }
    },

    MarkAsRead : async (notificationId: string): Promise<ServiceResult<void>> => {
        try {
            await axiosClient.post(`/api/Notification/${notificationId}/mark-as-read`)
            return ServiceResult.ok(undefined, 200)
        } catch (error) {
            return mapAxiosErrorToServiceResult<void>(error, 'Loi khi danh dau notification da doc')
        }
    },

    MarkAllAsRead : async() : Promise<ServiceResult<void>> => {
        try {
            await axiosClient.post(`/api/Notification/mark-all-as-read`)
            return ServiceResult.ok(undefined, 200)
        } catch (error) {
            return mapAxiosErrorToServiceResult<void>(error, 'Loi khi danh dau tat ca notification da doc')
        }
    },

    UnReadCount : async() : Promise<ServiceResult<number>> => {
        try {
            const response = await axiosClient.get<{unreadCount: number}>('/api/Notification/unread-count')
            return ServiceResult.ok(response.data.unreadCount, response.status)
        }
        catch (error) {
            return mapAxiosErrorToServiceResult<number>(error, 'Loi khi lay so luong notification chua doc')
        }
    },

    GetByType : async(type: string, skip: number, take: number) : Promise<ServiceResult<NotificationDto[]>> => {
        try {
            const response = await axiosClient.get<NotificationDto[]>(`/api/Notification/me/notification-type`, {
                params: {
                    type,   
                    skip,
                    take
                }
            })
            return ServiceResult.ok(response.data, response.status)
        } catch (error) {
            return mapAxiosErrorToServiceResult<NotificationDto[]>(error, 'Loi khi lay danh sach notification theo type')
        }
    }
}

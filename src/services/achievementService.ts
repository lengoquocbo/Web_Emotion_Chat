import { AchievementDto, UserAchievementDto } from "@/types/achievement"
import axiosClient from "./axiosClient"
import { ServiceResult } from "@/types/serviceResult"
import { mapAxiosErrorToServiceResult } from "./serviceResult"

export const achievementService = {
    GetAllAchievements : async() : Promise<ServiceResult<AchievementDto[]>> => {
        try {
            const response = await axiosClient.get<AchievementDto[]>('/api/Friendship')
            return ServiceResult.ok(response.data, response.status)
        } catch (error) {
            return mapAxiosErrorToServiceResult<AchievementDto[]>(error, 'Loi khi lay danh sach achievement')
        }
    },

    GetMyAchievements: async (): Promise<ServiceResult<UserAchievementDto[]>> => {
        try {
            const response = await axiosClient.get<UserAchievementDto[]>('/api/Achievement/me');
            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult<UserAchievementDto[]>(
                error, 
                'Lỗi khi lấy danh sách thành tựu'
            );
        }
    },

    GetMyAchievementById: async (achievementId: string): Promise<ServiceResult<UserAchievementDto>> => {
        try {
            const response = await axiosClient.get<UserAchievementDto>(
                `/api/Achievement/me/${achievementId}`
            );
            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult<UserAchievementDto>(
                error, 
                'Lỗi khi lấy thành tựu theo ID'
            );
        }
    },

    GetMyAchievementByCode: async (code: string): Promise<ServiceResult<UserAchievementDto>> => {
        try {
            const response = await axiosClient.get<UserAchievementDto>(
                `/api/Achievement/me/code/${code}`
            );
            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult<UserAchievementDto>(
                error, 
                'Lỗi khi lấy thành tựu theo code'
            );
        }
    },
}

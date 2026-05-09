import axiosClient from "./axiosClient";
import { mapAxiosErrorToServiceResult } from "./serviceResult";
import { ServiceResult } from "@/types/serviceResult";
import {
    CreateReflectionRequest,
    GetReflectionDistributionParams,
    GetReflectionHistoryParams,
    GetReflectionTagDistributionParams,
    GetReflectionTimelineParams,
    ReflectionAnalysisSummaryDto,
    ReflectionDto,
    ReflectionHistoryPagedResult,
    ReflectionMoodDistributionDto,
    ReflectionTagDistributionDto,
    ReflectionTimelinePointDto,
    ReflectionTransitionDto
} from "@/types/reflection";

export const ReflectionService = {
    Create : async (request : CreateReflectionRequest) : Promise<ServiceResult<ReflectionDto>> => {
        try {
            const response = await axiosClient.post<ReflectionDto>('/api/Reflection', request);
            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(error, 'Loi khi tao reflection');
        }
    },

    GetMine : async () : Promise<ServiceResult<ReflectionDto[]>> => {
        try {
            const response = await axiosClient.get<ReflectionDto[]>('/api/Reflection/my');
            return ServiceResult.ok(response.data, response.status);
        }
        catch (error) {
            return mapAxiosErrorToServiceResult(error, 'Loi khi lay danh sach reflection cua toi');
        }
    },

    GetMineByRoomId : async (roomId: string) : Promise<ServiceResult<ReflectionDto | null>> => {
        try {
            const response = await axiosClient.get<ReflectionDto | null>(`/api/Reflection/room/${roomId}/me`);
            return ServiceResult.ok(response.data, response.status);
        }
        catch (error) {
            return mapAxiosErrorToServiceResult(error, 'Loi khi lay danh sach reflection cua toi theo roomId');
        }
    },

    UpdateMineByRoomId : async (roomId: string, request: CreateReflectionRequest) : Promise<ServiceResult<ReflectionDto>> => {
        try {
            const response = await axiosClient.put<ReflectionDto>(`/api/Reflection/room/${roomId}/me`, request);
            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(error, 'Loi khi cap nhat reflection cua toi theo roomId');
        }
    },

    GetTags : async () : Promise<ServiceResult<string[]>> => {
        try {
            const response = await axiosClient.get<string[]>('/api/Reflection/tags');
            return ServiceResult.ok(response.data, response.status);
        }
        catch (error) {
            return mapAxiosErrorToServiceResult(error, 'Loi khi lay danh sach tags');
        }
    },

    getMyAnalysisSummary: async (): Promise<
        ServiceResult<ReflectionAnalysisSummaryDto>
    > => {
        try {
            const response =
                await axiosClient.get<ReflectionAnalysisSummaryDto>(
                    '/api/reflection/my/analysis/summary'
                );

            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(
                error,
                'Lỗi khi lấy tổng quan phân tích reflection'
            );
        }
    },

    getMyAnalysisTimeline: async (
        params?: GetReflectionTimelineParams
    ): Promise<ServiceResult<ReflectionTimelinePointDto[]>> => {
        try {
            const response =
                await axiosClient.get<ReflectionTimelinePointDto[]>(
                    '/api/reflection/my/analysis/timeline',
                    {
                        params
                    }
                );

            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(
                error,
                'Lỗi khi lấy timeline reflection'
            );
        }
    },

    getMyMoodDistribution: async (
        params?: GetReflectionDistributionParams
    ): Promise<ServiceResult<ReflectionMoodDistributionDto[]>> => {
        try {
            const response =
                await axiosClient.get<ReflectionMoodDistributionDto[]>(
                    '/api/reflection/my/analysis/mood-distribution',
                    {
                        params
                    }
                );

            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(
                error,
                'Lỗi khi lấy phân bố cảm xúc'
            );
        }
    },

    getMyTagDistribution: async (
        params?: GetReflectionTagDistributionParams
    ): Promise<ServiceResult<ReflectionTagDistributionDto[]>> => {
        try {
            const response =
                await axiosClient.get<ReflectionTagDistributionDto[]>(
                    '/api/reflection/my/analysis/tag-distribution',
                    {
                        params
                    }
                );

            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(
                error,
                'Lỗi khi lấy phân bố tag'
            );
        }
    },

    getMyTransitions: async (
        params?: GetReflectionDistributionParams
    ): Promise<ServiceResult<ReflectionTransitionDto[]>> => {
        try {
            const response =
                await axiosClient.get<ReflectionTransitionDto[]>(
                    '/api/reflection/my/analysis/transitions',
                    {
                        params
                    }
                );

            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(
                error,
                'Lỗi khi lấy chuyển đổi cảm xúc'
            );
        }
    },

    getMyHistory: async (
        params?: GetReflectionHistoryParams
    ): Promise<ServiceResult<ReflectionHistoryPagedResult>> => {
        try {
            const response =
                await axiosClient.get<ReflectionHistoryPagedResult>(
                    '/api/reflection/my/history',
                    {
                        params
                    }
                );

            return ServiceResult.ok(response.data, response.status);
        } catch (error) {
            return mapAxiosErrorToServiceResult(
                error,
                'Lỗi khi lấy lịch sử reflection'
            );
        }
    }
}

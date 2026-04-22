import axios from 'axios'

import { ServiceResult } from '@/types/serviceResult'

export const mapAxiosErrorToServiceResult = <T>(
  error: unknown,
  fallbackMessage: string,
): ServiceResult<T> => {
  if (axios.isAxiosError(error)) {
    return ServiceResult.fail<T>(
      error.response?.data?.message || error.message || fallbackMessage,
      error.response?.status ?? 500,
    )
  }

  return ServiceResult.fail<T>(fallbackMessage, 500)
}

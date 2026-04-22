export class ServiceResult<T> {
  success: boolean
  status: number
  data: T | null
  message: string | null

  private constructor(success: boolean, status: number, data: T | null, message: string | null) {
    this.success = success
    this.status = status
    this.data = data
    this.message = message
  }

  static ok<T>(data: T, status: number): ServiceResult<T> {
    return new ServiceResult<T>(true, status, data, null)
  }

  static fail<T>(message: string, status: number, data: T | null = null): ServiceResult<T> {
    return new ServiceResult<T>(false, status, data, message)
  }
}

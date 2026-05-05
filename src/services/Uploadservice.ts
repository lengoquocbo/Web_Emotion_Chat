import axiosClient from '@/services/axiosClient'
import type { FileUploadResponseDto } from '@/types/Chat'

// ─────────────────────────────────────────────────────────────────────────────
// Upload Service
// Gọi API /api/Upload/image và /api/Upload/file
// Backend trả về: { url, fileName, fileSize, fileType }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload một ảnh (jpg, jpeg, png, gif, webp — tối đa 10MB).
 * Backend lưu vào wwwroot/uploads/images/ và trả URL public.
 */
export async function uploadImage(file: File): Promise<FileUploadResponseDto> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosClient.post<FileUploadResponseDto>('/api/Upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

/**
 * Upload một file tài liệu (pdf, docx, txt, zip — tối đa 20MB).
 * Backend lưu vào wwwroot/uploads/files/ và trả URL public.
 */
export async function uploadFile(file: File): Promise<FileUploadResponseDto> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosClient.post<FileUploadResponseDto>('/api/Upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Kiểm tra xem file có phải là ảnh được hỗ trợ không */
export function isImageFile(file: File): boolean {
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return ALLOWED_IMAGE_TYPES.includes(file.type)
}

/** Kiểm tra xem file có phải là tài liệu được hỗ trợ không */
export function isDocumentFile(file: File): boolean {
  const ALLOWED_DOC_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
  ]
  return ALLOWED_DOC_TYPES.includes(file.type)
}

/** Format kích thước file sang dạng dễ đọc (KB, MB) */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
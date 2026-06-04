const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || ''

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''

  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`
  }

  try {
    const parsed = new URL(url)

    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.endsWith('.ngrok-free.dev')
    ) {
      return `${API_BASE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`
    }
  } catch {
    return url
  }

  return url
}

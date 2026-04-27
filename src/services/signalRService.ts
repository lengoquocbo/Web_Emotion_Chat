import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'

// ─── Config ──────────────────────────────────────────────────────────────────

// Timeout chờ trước mỗi lần retry (ms): 0s, 2s, 5s, 10s, rồi null = dừng
const RETRY_DELAYS = [0, 2_000, 5_000, 10_000]

// ─── Factory ──────────────────────────────────────────────────────────────────
// Tạo một HubConnection mới. Mỗi hub (chat / presence) gọi hàm này riêng.
// Token được đính qua query string vì cookie HttpOnly không forward được
// qua WebSocket upgrade trên một số browser — SignalR server đã xử lý
// `OnMessageReceived` để đọc access_token từ query (xem Program.cs).

export function createHubConnection(hubPath: '/hubs/chat' | '/hubs/presence'): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(hubPath, {
      // withCredentials: true để cookie "token" được gửi khi negotiate qua HTTP
      withCredentials: true,
    })
    .withAutomaticReconnect(RETRY_DELAYS)
    .configureLogging(
      import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning,
    )
    .build()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Kết nối an toàn: bỏ qua nếu đã connected/connecting */
export async function startConnection(connection: HubConnection): Promise<void> {
  if (
    connection.state === HubConnectionState.Connected ||
    connection.state === HubConnectionState.Connecting ||
    connection.state === HubConnectionState.Reconnecting
  ) {
    return
  }

  try {
    await connection.start()
  } catch (err) {
    console.error('[SignalR] Failed to connect:', err)
    throw err
  }
}

/** Ngắt kết nối an toàn: bỏ qua nếu đã disconnected */
export async function stopConnection(connection: HubConnection): Promise<void> {
  if (connection.state === HubConnectionState.Disconnected) return

  try {
    await connection.stop()
  } catch (err) {
    console.error('[SignalR] Failed to stop:', err)
  }
}

/** Gọi hub method, chỉ khi connection đang Connected */
export async function invokeHub<T = void>(
  connection: HubConnection,
  method: string,
  ...args: unknown[]
): Promise<T | undefined> {
  if (connection.state !== HubConnectionState.Connected) {
    console.warn(`[SignalR] invoke "${method}" skipped — not connected (state: ${connection.state})`)
    return undefined
  }

  try {
    return await connection.invoke<T>(method, ...args)
  } catch (err) {
    console.error(`[SignalR] invoke "${method}" error:`, err)
    throw err
  }
}

// ─── Connection state guard ───────────────────────────────────────────────────

export function isConnected(connection: HubConnection): boolean {
  return connection.state === HubConnectionState.Connected
}

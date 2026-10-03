import type { ClientMessage, ServerMessage } from "@seven/protocol";

export type SocketStatus = "idle" | "connecting" | "open" | "reconnecting" | "closed";

/** The subset of the WebSocket API the client relies on (lets tests inject a fake). */
export type SocketLike = {
  readonly readyState: number;
  onopen: (() => void) | null;
  onclose: (() => void) | null;
  onerror: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  send(data: string): void;
  close(): void;
};

export type SocketClientOptions = {
  url: string;
  createSocket?: (url: string) => SocketLike;
  /** API Gateway drops idle connections after 10 minutes. */
  pingIntervalMs?: number;
  /** Delays between reconnect attempts; the last one repeats. */
  backoffMs?: readonly number[];
};

const OPEN = 1;
const DEFAULT_BACKOFF = [1_000, 2_000, 4_000, 8_000, 15_000] as const;

/**
 * Single WebSocket connection with automatic reconnection and keep-alive.
 * Only one socket and one pending timer exist at any time, so a stale reconnect
 * can never replace a fresh connection.
 */
export function createSocketClient(options: SocketClientOptions) {
  const createSocket = options.createSocket ?? ((url) => new WebSocket(url) as unknown as SocketLike);
  const pingIntervalMs = options.pingIntervalMs ?? 5 * 60_000;
  const backoff = options.backoffMs ?? DEFAULT_BACKOFF;

  let socket: SocketLike | null = null;
  let status: SocketStatus = "idle";
  let wantOpen = false;
  let attempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let openWaiters: { resolve: () => void; reject: (error: Error) => void }[] = [];

  const messageListeners = new Set<(message: ServerMessage) => void>();
  const statusListeners = new Set<(status: SocketStatus) => void>();
  const openListeners = new Set<() => void>();

  const setStatus = (next: SocketStatus) => {
    if (status === next) return;
    status = next;
    statusListeners.forEach((listener) => listener(next));
  };

  const clearTimers = () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (pingTimer) clearInterval(pingTimer);
    reconnectTimer = null;
    pingTimer = null;
  };

  const detach = () => {
    if (!socket) return;
    socket.onopen = socket.onclose = socket.onerror = socket.onmessage = null;
    try {
      socket.close();
    } catch {
      // Already closed.
    }
    socket = null;
  };

  const settleWaiters = (error?: Error) => {
    const waiters = openWaiters;
    openWaiters = [];
    waiters.forEach((waiter) => (error ? waiter.reject(error) : waiter.resolve()));
  };

  const scheduleReconnect = () => {
    clearTimers();
    setStatus("reconnecting");
    const delay = backoff[Math.min(attempt, backoff.length - 1)];
    attempt += 1;
    reconnectTimer = setTimeout(connect, delay);
  };

  function connect() {
    clearTimers();
    detach();
    setStatus(attempt === 0 ? "connecting" : "reconnecting");
    const ws = createSocket(options.url);
    socket = ws;

    ws.onopen = () => {
      attempt = 0;
      setStatus("open");
      pingTimer = setInterval(() => send({ action: "ping" }), pingIntervalMs);
      settleWaiters();
      openListeners.forEach((listener) => listener());
    };
    ws.onmessage = (event) => {
      let message: ServerMessage;
      try {
        message = JSON.parse(String(event.data)) as ServerMessage;
      } catch {
        return;
      }
      messageListeners.forEach((listener) => listener(message));
    };
    ws.onerror = () => {
      // onclose always follows; reconnection is handled there.
    };
    ws.onclose = () => {
      socket = null;
      clearTimers();
      if (!wantOpen) {
        setStatus("closed");
        return;
      }
      // The first connection attempt failing is reported to whoever is waiting for it.
      if (openWaiters.length > 0) settleWaiters(new Error("Connection failed"));
      scheduleReconnect();
    };
  }

  function send(message: ClientMessage): boolean {
    if (!socket || socket.readyState !== OPEN) return false;
    socket.send(JSON.stringify(message));
    return true;
  }

  return {
    get status() {
      return status;
    },

    /** Opens the connection (no-op when already open) and keeps it alive until `close`. */
    open(): Promise<void> {
      wantOpen = true;
      if (status === "open") return Promise.resolve();
      const opened = new Promise<void>((resolve, reject) => openWaiters.push({ resolve, reject }));
      if (status !== "connecting" && status !== "reconnecting") {
        attempt = 0;
        connect();
      }
      return opened;
    },

    send,

    /** Closes the connection for good (no reconnection). */
    close() {
      wantOpen = false;
      clearTimers();
      detach();
      settleWaiters(new Error("Closed"));
      setStatus("closed");
    },

    onMessage(listener: (message: ServerMessage) => void) {
      messageListeners.add(listener);
      return () => messageListeners.delete(listener);
    },
    onStatus(listener: (status: SocketStatus) => void) {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
    /** Called on every successful (re)connection. */
    onOpen(listener: () => void) {
      openListeners.add(listener);
      return () => openListeners.delete(listener);
    },
  };
}

export type SocketClient = ReturnType<typeof createSocketClient>;

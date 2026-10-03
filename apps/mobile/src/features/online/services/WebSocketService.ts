import type { ServerMessage } from "@/src/features/online/types/server";

type MessageHandler = (data: ServerMessage) => void;
type VoidHandler = () => void;

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 16000;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string | null = null;
  private displayName: string | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private closeHandlers = new Set<VoidHandler>();
  private openHandlers = new Set<VoidHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private shouldReconnect = false;
  private _connected = false;

  get connected(): boolean {
    return this._connected;
  }

  connect(url: string, displayName: string): Promise<void> {
    this.url = url;
    this.displayName = displayName;
    this.shouldReconnect = true;
    this.reconnectAttempt = 0;
    return this.doConnect();
  }

  private doConnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onclose = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        try {
          this.ws.close();
        } catch {
          /* ignore */
        }
      }

      const wsUrl = `${this.url}?displayName=${encodeURIComponent(this.displayName ?? "Player")}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        this._connected = true;
        this.reconnectAttempt = 0;
        this.openHandlers.forEach((h) => h());
        resolve();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string) as ServerMessage;
          this.messageHandlers.forEach((h) => h(data));
        } catch {
          /* ignore malformed messages */
        }
      };

      ws.onclose = () => {
        this._connected = false;
        this.closeHandlers.forEach((h) => h());
        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      };

      ws.onerror = () => {
        if (!this._connected) {
          reject(new Error("WebSocket connection failed"));
        }
      };

      this.ws = ws;
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    const delay = Math.min(
      RECONNECT_BASE_MS * Math.pow(2, this.reconnectAttempt),
      RECONNECT_MAX_MS,
    );
    this.reconnectAttempt++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.doConnect().catch(() => {
        /* reconnect failures will trigger another attempt via onclose */
      });
    }, delay);
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this._connected = false;
  }

  send(action: string, payload?: Record<string, unknown>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ action, payload }));
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onClose(handler: VoidHandler): () => void {
    this.closeHandlers.add(handler);
    return () => {
      this.closeHandlers.delete(handler);
    };
  }

  onOpen(handler: VoidHandler): () => void {
    this.openHandlers.add(handler);
    return () => {
      this.openHandlers.delete(handler);
    };
  }

  removeAllListeners(): void {
    this.messageHandlers.clear();
    this.closeHandlers.clear();
    this.openHandlers.clear();
  }
}

export const wsService = new WebSocketService();

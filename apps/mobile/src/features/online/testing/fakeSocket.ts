import type { ClientMessage, ServerMessage } from "@seven/protocol";
import type { SocketLike } from "@/src/features/online/services/socketClient";

/** In-memory stand-in for a WebSocket; tests drive it with `open`, `drop` and `receive`. */
export class FakeSocket implements SocketLike {
  static instances: FakeSocket[] = [];
  static latest = () => FakeSocket.instances[FakeSocket.instances.length - 1]!;

  readyState = 0;
  sent: ClientMessage[] = [];
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;

  constructor(readonly url: string) {
    FakeSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(JSON.parse(data) as ClientMessage);
  }

  close() {
    this.readyState = 3;
  }

  open() {
    this.readyState = 1;
    this.onopen?.();
  }

  /** Simulates the network dropping the connection. */
  drop() {
    this.readyState = 3;
    this.onclose?.();
  }

  receive(message: ServerMessage) {
    this.onmessage?.({ data: JSON.stringify(message) });
  }

  actions() {
    return this.sent.map((m) => m.action);
  }
}

export const createFakeSocket = (url: string) => new FakeSocket(url);

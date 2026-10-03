import { createSocketClient } from "@/src/features/online/services/socketClient";
import { FakeSocket, createFakeSocket } from "@/src/features/online/testing/fakeSocket";

beforeEach(() => {
  jest.useFakeTimers();
  FakeSocket.instances = [];
});
afterEach(() => jest.useRealTimers());

const create = () =>
  createSocketClient({
    url: "wss://test",
    createSocket: createFakeSocket,
    backoffMs: [1_000, 2_000],
    pingIntervalMs: 60_000,
  });

describe("socket client", () => {
  it("resolves open() once connected and refuses to send before that", async () => {
    const client = create();
    const opened = client.open();
    expect(client.send({ action: "ping" })).toBe(false);
    FakeSocket.latest().open();
    await opened;
    expect(client.status).toBe("open");
    expect(client.send({ action: "ping" })).toBe(true);
  });

  it("rejects open() when the first attempt fails", async () => {
    const client = create();
    const opened = client.open();
    FakeSocket.latest().drop();
    await expect(opened).rejects.toThrow("Connection failed");
    client.close();
  });

  it("reconnects with backoff and notifies onOpen each time", async () => {
    const client = create();
    const onOpen = jest.fn();
    client.onOpen(onOpen);
    const opened = client.open();
    FakeSocket.latest().open();
    await opened;

    FakeSocket.latest().drop();
    expect(client.status).toBe("reconnecting");
    jest.advanceTimersByTime(999);
    expect(FakeSocket.instances).toHaveLength(1);
    jest.advanceTimersByTime(1);
    expect(FakeSocket.instances).toHaveLength(2);
    FakeSocket.latest().open();
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("never lets a stale reconnect replace an explicit new connection", async () => {
    const client = create();
    const first = client.open();
    FakeSocket.latest().open();
    await first;
    FakeSocket.latest().drop();
    client.close();
    const second = client.open();
    FakeSocket.latest().open();
    await second;
    const current = FakeSocket.latest();
    jest.advanceTimersByTime(10_000);
    expect(FakeSocket.latest()).toBe(current);
  });

  it("pings to keep the connection alive and stops after close", async () => {
    const client = create();
    const opened = client.open();
    const socket = FakeSocket.latest();
    socket.open();
    await opened;
    jest.advanceTimersByTime(60_000);
    expect(socket.actions()).toEqual(["ping"]);
    client.close();
    jest.advanceTimersByTime(120_000);
    expect(socket.actions()).toEqual(["ping"]);
    expect(client.status).toBe("closed");
  });
});

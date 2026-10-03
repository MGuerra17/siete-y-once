/** Thrown (and swallowed by `runCancellable`) when a sequenced flow is cancelled. */
export class CancelledError extends Error {
  constructor() {
    super("Cancelled");
    this.name = "CancelledError";
  }
}

/** Resolves after `ms`, or rejects with `CancelledError` as soon as `signal` aborts. */
export const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new CancelledError());
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new CancelledError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });

/** Runs an async flow, ignoring cancellation and reporting any other failure. */
export const runCancellable = (flow: () => Promise<void>): void => {
  flow().catch((error: unknown) => {
    if (error instanceof CancelledError) return;
    console.error(error);
  });
};

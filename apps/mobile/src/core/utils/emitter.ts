export type Listener<T> = (event: T) => void;

/**
 * Minimal typed pub/sub used by controllers to notify the UI (sounds, haptics).
 * A failing listener is reported and skipped: side effects must never break game flow.
 */
export function createEmitter<T>() {
  const listeners = new Set<Listener<T>>();
  return {
    emit(event: T) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.warn("Event listener failed", error);
        }
      });
    },
    subscribe(listener: Listener<T>): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type Emitter<T> = ReturnType<typeof createEmitter<T>>;

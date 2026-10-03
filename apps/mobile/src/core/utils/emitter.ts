export type Listener<T> = (event: T) => void;

/** Minimal typed pub/sub used by controllers to notify the UI (sounds, haptics). */
export function createEmitter<T>() {
  const listeners = new Set<Listener<T>>();
  return {
    emit(event: T) {
      listeners.forEach((listener) => listener(event));
    },
    subscribe(listener: Listener<T>): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type Emitter<T> = ReturnType<typeof createEmitter<T>>;

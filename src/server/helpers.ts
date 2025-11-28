import type { EventEmitter } from "stream";

export function multiOn<T extends Record<string, any>>(
  ee: EventEmitter,
  events: (keyof T)[],
  signal?: AbortSignal,
): AsyncIterableIterator<[event: string, data: any]> {
  const queue: Array<[string, any]> = [];
  let resolve: (() => void) | null = null;

  for (const event of events) {
    ee.on(event as string, (data) => {
      queue.push([event as string, data]);
      resolve?.();
    });
  }

  if (signal) {
    signal.addEventListener("abort", () => {
      resolve?.();
    });
  }

  return {
    async next() {
      if (signal?.aborted) return { done: true, value: undefined };

      if (queue.length === 0) {
        await new Promise<void>((r) => (resolve = r));
        resolve = null;
      }

      const item = queue.shift();
      if (!item) return { done: true, value: undefined };

      return { done: false, value: item };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

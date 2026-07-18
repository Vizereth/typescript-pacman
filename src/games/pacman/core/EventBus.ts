import type { EventCallback, EventKey, GameEventMap } from "./Events.js";

export class EventBus {
  private listeners: { [K in EventKey]?: EventCallback<K>[] } = {};

  /**
   * Subscribe to a typed game event channel.
   */
  public on<K extends EventKey>(event: K, callback: EventCallback<K>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  /**
   * Unsubscribe from an explicit game event channel.
   */
  public off<K extends EventKey>(event: K, callback: EventCallback<K>): void {
    const list = this.listeners[event];
    if (!list) return;

    this.listeners[event] = list.filter((cb) => cb !== callback) as any;
  }

  /**
   * Dispatches events asynchronously across the engine architecture boundaries.
   * Leverages immediate execution wrappers to keep the physics and graphics loops isolated.
   */
  public emit<K extends EventKey>(event: K, payload: GameEventMap[K]): void {
    const list = this.listeners[event];
    if (!list || list.length === 0) return;

    // Fast-loop execution inside safe asynchronous scheduling blocks
    queueMicrotask(() => {
      const len = list.length;
      for (let i = 0; i < len; i++) {
        list[i](payload);
      }
    });
  }
}


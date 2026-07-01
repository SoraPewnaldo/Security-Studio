import type { EventMap, EventName } from '@security-studio/types';

type EventHandler<T extends EventName> = (payload: EventMap[T]) => void;

/**
 * Typed global event bus.
 * Decouples tool actions from side effects (history logging, favorites sync, etc.)
 */
class EventBus {
  private listeners: Map<EventName, Set<EventHandler<EventName>>> = new Map();

  on<T extends EventName>(event: T, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    handlers.add(handler as EventHandler<EventName>);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as EventHandler<EventName>);
    };
  }

  emit<T extends EventName>(event: T, payload: EventMap[T]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for "${event}":`, err);
        }
      }
    }
  }

  off<T extends EventName>(event: T, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler as EventHandler<EventName>);
    }
  }

  /** Remove all listeners for an event, or all events if no event specified */
  clear(event?: EventName): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

/** Singleton event bus */
export const eventBus = new EventBus();
export { EventBus };

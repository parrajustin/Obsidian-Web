import { EventRef } from "./event_ref";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallbackT = (...data: any) => unknown;

/**
 * Events registration system.
 */
export class Events {
  private eventMap = new Map<string, Set<CallbackT>>();

  /**
   * Create a callback that is called when the event with `name` is triggered.
   */
  public on(name: string, callback: CallbackT, ctx?: unknown): EventRef {
    if (ctx !== undefined) {
      callback = callback.bind(ctx);
    }
    let cbs = this.eventMap.get(name);
    if (cbs === undefined) {
      cbs = new Set<CallbackT>();
      this.eventMap.set(name, cbs);
    }
    return new EventRef(
      /*deRef=*/ () => {
        const setOfCbs = this.eventMap.get(name);
        if (setOfCbs !== undefined) {
          setOfCbs.delete(callback);
        }
      },
      callback
    );
  }
  /**
   * Remove the callback from teh event with `name` callbacks.
   */
  public off(name: string, callback: CallbackT): void {
    const setOfCbs = this.eventMap.get(name);
    if (setOfCbs !== undefined) {
      setOfCbs.delete(callback);
    }
  }
  /**
   * Turn off an event callback. Even if the eventref isn't for this events it'll be disabled.
   */
  public offref(ref: EventRef): void {
    ref.disableEventRef();
  }
  /**
   * Trigger the given callbacks for the event with `name` with the `data`.
   */
  public trigger(name: string, ...data: unknown[]): void {
    const setOfCbs = this.eventMap.get(name);
    if (setOfCbs !== undefined) {
      for (const cb of setOfCbs) {
        cb(...data);
      }
    }
  }
  /**
   * Try and trigger an event ref with the given data.
   */
  tryTrigger(evt: EventRef, args: unknown[]): void {
    if (!evt.isDisabled) {
      evt.callback(...args);
    }
  }
}

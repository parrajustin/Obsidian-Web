import type { EventRef } from "./event_ref";

type EventKey<T> = T extends Window
  ? keyof WindowEventMap
  : T extends Document
    ? keyof DocumentEventMap
    : T extends HTMLElement
      ? keyof HTMLElementEventMap
      : never;
type Callback<T> = T extends Window
  ? (this: HTMLElement, ev: WindowEventMap[EventKey<T>]) => void
  : T extends Document
    ? (this: HTMLElement, ev: DocumentEventMap[EventKey<T>]) => void
    : T extends HTMLElement
      ? (this: HTMLElement, ev: HTMLElementEventMap[EventKey<T>]) => void
      : never;

/**
 * @public
 */
export class Component {
  private children = new Set<Component>();
  private eventRefs: EventRef[] = [];

  /**
   * Load this component and its children
   */
  public load(): void {
    this.onload();

    for (const component of this.children) {
      component.load();
    }
  }
  /**
   * Override this to load your component
   * @public
   * @virtual
   */
  public onload(): void {}
  /**
   * Unload this component and its children
   * @public
   */
  public unload(): void {
    this.onunload();

    for (const ref of this.eventRefs) {
      ref.deRef();
    }

    for (const component of this.children) {
      component.unload();
    }
  }
  /**
   * Override this to unload your component
   * @public
   * @virtual
   */
  public onunload(): void {}
  /**
   * Adds a child component, loading it if this component is loaded
   * @public
   */
  public addChild<T extends Component>(component: T): T {
    this.children.add(component);
    return component;
  }
  /**
   * Removes a child component, unloading it
   * @public
   */
  public removeChild<T extends Component>(component: T): T {
    this.children.delete(component);
    return component;
  }
  /**
   * Registers a callback to be called when unloading
   * @public
   */
  public register(cb: () => void): void {
    this.eventRefs.push({ deRef: cb });
  }
  /**
   * Registers an event to be detached when unloading
   * @public
   */
  public registerEvent(eventRef: EventRef): void {
    this.eventRefs.push(eventRef);
  }
  /**
   * Registers an DOM event to be detached when unloading
   * @public
   */
  public registerDomEvent<T extends Window | Document | HTMLElement>(
    el: Window,
    type: EventKey<T>,
    callback: Callback<T>,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.eventRefs.push({
      deRef: () => {
        el.removeEventListener(type, callback, options);
      }
    });
  }
  /**
   * Registers an interval (from setInterval) to be cancelled when unloading
   * Use {@link window.setInterval} instead of {@link setInterval} to avoid TypeScript confusing between NodeJS vs Browser API
   * @public
   */
  public registerInterval(id: number): number {
    this.eventRefs.push({
      deRef: () => {
        window.clearInterval(id);
      }
    });
    return id;
  }
}

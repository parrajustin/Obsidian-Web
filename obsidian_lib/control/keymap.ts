import { PaneType } from "../ui/pane_type";
import type { Modifier, Scope } from "./scope";

/** @public */
export type UserEvent = MouseEvent | KeyboardEvent | TouchEvent | PointerEvent;

/**
 * Manages keymap lifecycle for different {@link Scope}s.
 *
 * @public
 */
export class Keymap {
  private scopes: Scope[] = [];

  /**
   * Push a scope onto the scope stack, setting it as the active scope to handle all key events.
   * @public
   */
  pushScope(scope: Scope): void {
    this.scopes.push(scope);
  }
  /**
   * Remove a scope from the scope stack.
   * If the given scope is active, the next scope in the stack will be made active.
   * @public
   */
  popScope(scope: Scope): void {
    this.scopes = this.scopes.filter((s) => s !== scope);
  }

  /**
   * Checks whether the modifier key is pressed during this event.
   * @public
   */
  static isModifier(evt: MouseEvent | TouchEvent | KeyboardEvent, modifier: Modifier): boolean {
    switch (modifier) {
      case "Mod":
        return evt.metaKey;
      case "Ctrl":
        return evt.ctrlKey;
      case "Meta":
        return evt.metaKey;
      case "Shift":
        return evt.shiftKey;
      case "Alt":
        return evt.altKey;
    }
  }

  /**
   * Translates an event into the type of pane that should open.
   * Returns 'tab' if the modifier key Cmd/Ctrl is pressed OR if this is a middle-click MouseEvent.
   * Returns 'split' if Cmd/Ctrl+Alt is pressed.
   * Returns 'window' if Cmd/Ctrl+Alt+Shift is pressed.
   * @public
   * */
  static isModEvent(evt?: UserEvent | null): PaneType | boolean {
    if (evt === null || evt === undefined) {
      return false;
    }

    if (evt.ctrlKey || evt.metaKey || (evt instanceof MouseEvent && evt.button === 1)) {
      return "tab";
    }
    if ((evt.ctrlKey || evt.metaKey) && evt.altKey) {
      return "split";
    }
    if ((evt.ctrlKey || evt.metaKey) && evt.altKey && evt.shiftKey) {
      return "window";
    }

    return false;
  }
}

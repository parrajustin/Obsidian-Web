import type { KeymapContext } from "./keymap_context";
import type { KeymapEventHandler } from "./keymap_event_handler";

/**
 * Return `false` to automatically preventDefault
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KeymapEventListener = (evt: KeyboardEvent, ctx: KeymapContext) => false | any;

/**
 * Mod = Cmd on MacOS and Ctrl on other OS
 * Ctrl = Ctrl key for every OS
 * Meta = Cmd on MacOS and Win key on other OS
 * @public
 */
export type Modifier = "Mod" | "Ctrl" | "Meta" | "Shift" | "Alt";

/**
 * A scope receives keyboard events and binds callbacks to given hotkeys.
 * Only one scope is active at a time, but scopes may define parent scopes (in the constructor) and inherit their hotkeys.
 * @public
 */
export class Scope {
  public keymapEventHandlers = new Set<KeymapEventHandler>();

  /**
   * @public
   */
  constructor(private parent?: Scope) {}
  /**
   * Add a keymap event handler to this scope.
   * @param modifiers - `Mod`, `Ctrl`, `Meta`, `Shift`, or `Alt`. `Mod` translates to `Meta` on macOS and `Ctrl` otherwise.
   * @param key - Keycode from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key%5FValues
   * @param func - the callback that will be called when a user triggers the keybind.
   * @public
   */
  register(
    modifiers: Modifier[],
    key: string | null,
    func: KeymapEventListener
  ): KeymapEventHandler {
    
  }
  /**
   * Remove an existing keymap event handler.
   * @public
   */
  unregister(handler: KeymapEventHandler): void;
}

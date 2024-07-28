import type { KeymapInfo } from "./keymap_info";
import type { Scope } from "./scope";

/**
 * @public
 */
export interface KeymapEventHandler extends KeymapInfo {
  /** @public */
  scope: Scope;
}

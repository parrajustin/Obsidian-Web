import type { KeymapInfo } from "./keymap_info";

/**
 * @public
 */
export interface KeymapContext extends KeymapInfo {
  /**
   * Interpreted virtual key.
   * @public
   */
  vkey: string;
}

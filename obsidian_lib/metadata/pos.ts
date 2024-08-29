import type { Loc } from "./loc";

/**
 * @public
 */
export interface Pos {
  /**
   * @public
   */
  start: Loc;
  /**
   * @public
   */
  end: Loc;
}

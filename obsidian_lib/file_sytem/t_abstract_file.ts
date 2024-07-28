import type { TFolder } from "./t_folder";
import type { Vault } from "./vault";

/**
 * This can be either a `TFile` or a `TFolder`.
 * @public
 */
export abstract class TAbstractFile {
  /**
   * @public
   */
  vault: Vault;
  /**
   * @public
   */
  path: string;
  /**
   * @public
   */
  name: string;
  /**
   * @public
   */
  parent: TFolder | null;
}

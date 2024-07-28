import type { FileStats } from "./file_stats";
import { TAbstractFile } from "./t_abstract_file";

/**
 * @public
 */
export class TFile extends TAbstractFile {
  /**
   * @public
   */
  stat: FileStats;
  /**
   * @public
   */
  basename: string;
  /**
   * @public
   */
  extension: string;
}

import { App } from "../app";
import { TFile } from "../file_sytem/t_file";
import type { HoverParent } from "./hover_parent";

/**
 * @public
 */
export interface MarkdownFileInfo extends HoverParent {
  /**
   * @public
   */
  app: App;
  /**
   * @public
   */
  get file(): TFile | null;

  /**
   * @public
   */
  editor?: Editor;
}
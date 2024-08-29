import { WorkspaceContainer } from "obsidian";

/**
 * @public
 */
export class WorkspaceWindow extends WorkspaceContainer {
  /** @public */
  win: Window;
  /** @public */
  doc: Document;
}

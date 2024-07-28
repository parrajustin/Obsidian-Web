import { WorkspaceSplit } from "./workspace_split";

/**
 * @public
 */
export abstract class WorkspaceContainer extends WorkspaceSplit {
  /** @public */
  abstract win: Window;
  /** @public */
  abstract doc: Document;
}

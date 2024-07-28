import { WorkspaceContainer } from "./workspace_container";
import { WorkspaceParent } from "./workspace_parent";
import type { WorkspaceSplit } from "./workspace_split";

/**
 * @public
 */
export class WorkspaceTabs extends WorkspaceParent {
  getContainer(): WorkspaceContainer {
    throw new Error("Method not implemented.");
  }
  /** @public */
  parent: WorkspaceSplit;
}

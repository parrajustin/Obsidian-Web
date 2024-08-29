import type { WorkspaceContainer } from "./workspace_container";
import { WorkspaceParent } from "./workspace_parent";

/**
 * @public
 */
export class WorkspaceSplit extends WorkspaceParent {
  getContainer(): WorkspaceContainer {
    throw new Error("Method not implemented.");
  }
  /** @public */
  parent: WorkspaceParent;
}

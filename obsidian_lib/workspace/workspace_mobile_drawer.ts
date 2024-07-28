import { WorkspaceContainer } from "./workspace_container";
import { WorkspaceParent } from "./workspace_parent";

/**
 * @public
 */
export class WorkspaceMobileDrawer extends WorkspaceParent {
  getContainer(): WorkspaceContainer {
    throw new Error("Method not implemented.");
  }
  /** @public */
  parent: WorkspaceParent;

  /** @public */
  collapsed: boolean;

  /** @public */
  expand(): void;

  /** @public */
  collapse(): void;

  /** @public */
  toggle(): void;
}

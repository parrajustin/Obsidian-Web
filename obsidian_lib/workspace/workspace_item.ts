import { Events } from "obsidian_lib/events";
import type { WorkspaceParent } from "./workspace_parent";
import type { WorkspaceContainer } from "./workspace_container";

/**
 * @public
 */
export abstract class WorkspaceItem extends Events {
  /**
   * The direct parent of the leaf.
   * @public
   */
  abstract parent: WorkspaceParent;

  /**
   * @public
   */
  getRoot(): WorkspaceItem {
    return this.parent;
  }
  /**
   * Get the root container parent item, which can be one of:
   * - {@link WorkspaceRoot}
   * - {@link WorkspaceWindow}
   * @public
   */
  abstract getContainer(): WorkspaceContainer;
}

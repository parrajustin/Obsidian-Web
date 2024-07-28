import { WorkspaceItem } from "./workspace_item";
import { WorkspaceMobileDrawer } from "./workspace_mobile_drawer";
import { WorkspaceTabs } from "./workspace_tabs";

/**
 * @public
 */
export class WorkspaceLeaf extends WorkspaceItem {

  /**
   * The direct parent of the leaf.
   *
   * On desktop, a leaf is always a child of a `WorkspaceTabs` component.
   * On mobile, a leaf might be a child of a `WorkspaceMobileDrawer`.
   * Perform an `instanceof` check before making an assumption about the
   * `parent`.
   *
   * @public
   */
  parent: WorkspaceTabs | WorkspaceMobileDrawer;

  /**
   * @public
   */
  view: View;

  /**
   * By default, `openFile` will also make the leaf active.
   * Pass in `{ active: false }` to override.
   *
   * @public
   */
  openFile(file: TFile, openState?: OpenViewState): Promise<void>;

  /**
   * @public
   */
  open(view: View): Promise<View>;

  /**
   * @public
   */
  getViewState(): ViewState;
  /**
   * @public
   */
  setViewState(viewState: ViewState, eState?: any): Promise<void>;

  /**
   * @public
   */
  getEphemeralState(): any;
  /**
   * @public
   */
  setEphemeralState(state: any): void;
  /**
   * @public
   */
  togglePinned(): void;
  /**
   * @public
   */
  setPinned(pinned: boolean): void;
  /**
   * @public
   */
  setGroupMember(other: WorkspaceLeaf): void;
  /**
   * @public
   */
  setGroup(group: string): void;
  /**
   * @public
   */
  detach(): void;

  /**
   * @public
   */
  getIcon(): IconName;
  /**
   * @public
   */
  getDisplayText(): string;

  /**
   * @public
   */
  onResize(): void;

  /**
   * @public
   */
  on(name: 'pinned-change', callback: (pinned: boolean) => any, ctx?: any): EventRef;
  /**
   * @public
   */
  on(name: 'group-change', callback: (group: string) => any, ctx?: any): EventRef;

}
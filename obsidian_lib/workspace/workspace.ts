import { Events } from "../events";
import type { WorkspaceLeaf } from "./workspace_leaf";
import type { WorkspaceMobileDrawer } from "./workspace_mobile_drawer";
import type { WorkspaceRibbon } from "./workspace_ribbon";
import type { WorkspaceRoot } from "./workspace_root";
import type { WorkspaceSidedock } from "./workspace_sidedock";

/**
 * @public
 */
export class Workspace extends Events {

  /**
   * @public
   */
  leftSplit: WorkspaceSidedock | WorkspaceMobileDrawer;
  /**
   * @public
   */
  rightSplit: WorkspaceSidedock | WorkspaceMobileDrawer;
  /**
   * @public
   */
  leftRibbon: WorkspaceRibbon;
  /**
   * @public
   */
  rightRibbon: WorkspaceRibbon;
  /**
   * @public
   */
  rootSplit: WorkspaceRoot;

  /**
   * Indicates the currently focused leaf, if one exists.
   *
   * Please avoid using `activeLeaf` directly, especially without checking whether
   * `activeLeaf` is null.
   *
   * The recommended alternatives are:
   * - If you need information about the current view, use {@link Workspace.getActiveViewOfType}.
   * - If you need to open a new file or navigate a view, use {@link Workspace.getLeaf}.
   *
   * @public
   * @deprecated - The use of this field is discouraged.
   */
  activeLeaf: WorkspaceLeaf | null;

  /**
   * @public
   */
  containerEl: HTMLElement;
  /**
   * @public
   */
  layoutReady: boolean;
  /**
   * @public
   */
  requestSaveLayout: Debouncer<[], Promise<void>>;

  /**
   * A component managing the current editor. This can be null
   * if the active view has no editor.
   * @public
   */
  activeEditor: MarkdownFileInfo | null;

  /**
   * Runs the callback function right away if layout is already ready,
   * or push it to a queue to be called later when layout is ready.
   * @public
   * */
  onLayoutReady(callback: () => any): void;
  /**
   * @public
   */
  changeLayout(workspace: any): Promise<void>;

  /**
   * @public
   */
  getLayout(): any;

  /**
   * @public
   */
  createLeafInParent(parent: WorkspaceSplit, index: number): WorkspaceLeaf;

  /**
   * @public
   */
  createLeafBySplit(leaf: WorkspaceLeaf, direction?: SplitDirection, before?: boolean): WorkspaceLeaf;
  /**
   * @public
   * @deprecated - You should use {@link Workspace.getLeaf|getLeaf(true)} instead which does the same thing.
   */
  splitActiveLeaf(direction?: SplitDirection): WorkspaceLeaf;

  /**
   * @public
   * @deprecated - Use the new form of this method instead
   */
  duplicateLeaf(leaf: WorkspaceLeaf, direction?: SplitDirection): Promise<WorkspaceLeaf>;
  /**
   * @public
   */
  duplicateLeaf(leaf: WorkspaceLeaf, leafType: PaneType | boolean, direction?: SplitDirection): Promise<WorkspaceLeaf>;
  /**
   * @public
   * @deprecated - You should use {@link Workspace.getLeaf|getLeaf(false)} instead which does the same thing.
   */
  getUnpinnedLeaf(): WorkspaceLeaf;
  /**
   * Creates a new leaf in a leaf adjacent to the currently active leaf.
   * If direction is `'vertical'`, the leaf will appear to the right.
   * If direction is `'horizontal'`, the leaf will appear below the current leaf.
   *
   * @public
   */
  getLeaf(newLeaf?: 'split', direction?: SplitDirection): WorkspaceLeaf;
  /**
   * If newLeaf is false (or not set) then an existing leaf which can be navigated
   * is returned, or a new leaf will be created if there was no leaf available.
   *
   * If newLeaf is `'tab'` or `true` then a new leaf will be created in the preferred
   * location within the root split and returned.
   *
   * If newLeaf is `'split'` then a new leaf will be created adjacent to the currently active leaf.
   *
   * If newLeaf is `'window'` then a popout window will be created with a new leaf inside.
   *
   * @public
   */
  getLeaf(newLeaf?: PaneType | boolean): WorkspaceLeaf;

  /**
   * Migrates this leaf to a new popout window.
   * Only works on the desktop app.
   * @public
   */
  moveLeafToPopout(leaf: WorkspaceLeaf, data?: WorkspaceWindowInitData): WorkspaceWindow;

  /**
   * Open a new popout window with a single new leaf and return that leaf.
   * Only works on the desktop app.
   * @public
   */
  openPopoutLeaf(data?: WorkspaceWindowInitData): WorkspaceLeaf;
  /**
   * @public
   */
  openLinkText(linktext: string, sourcePath: string, newLeaf?: PaneType | boolean, openViewState?: OpenViewState): Promise<void>;
  /**
   * Sets the active leaf
   * @param leaf - The new active leaf
   * @param params - Parameter object of whether to set the focus.
   * @public
   */
  setActiveLeaf(leaf: WorkspaceLeaf, params?: {
      /** @public */
      focus?: boolean;
  }): void;
  /**
   * @deprecated - function signature changed. Use other form instead
   * @public
   */
  setActiveLeaf(leaf: WorkspaceLeaf, pushHistory: boolean, focus: boolean): void;

  /**
   * @public
   */
  getLeafById(id: string): WorkspaceLeaf | null;
  /**
   * @public
   */
  getGroupLeaves(group: string): WorkspaceLeaf[];

  /**
   * @public
   */
  getMostRecentLeaf(root?: WorkspaceParent): WorkspaceLeaf | null;
  /**
   * @public
   */
  getLeftLeaf(split: boolean): WorkspaceLeaf | null;
  /**
   * @public
   */
  getRightLeaf(split: boolean): WorkspaceLeaf | null;

  /**
   * @public
   */
  getActiveViewOfType<T extends View>(type: Constructor<T>): T | null;

  /**
   * Returns the file for the current view if it's a FileView.
   *
   * Otherwise, it will recent the most recently active file.
   *
   * @public
   */
  getActiveFile(): TFile | null;

  /**
   * Iterate through all leaves in the main area of the workspace.
   * @public
   */
  iterateRootLeaves(callback: (leaf: WorkspaceLeaf) => any): void;
  /**
   * Iterate through all leaves, including main area leaves, floating leaves, and sidebar leaves.
   * @public
   */
  iterateAllLeaves(callback: (leaf: WorkspaceLeaf) => any): void;
  /**
   * @public
   */
  getLeavesOfType(viewType: string): WorkspaceLeaf[];
  /**
   * @public
   */
  detachLeavesOfType(viewType: string): void;

  /**
   * @public
   */
  revealLeaf(leaf: WorkspaceLeaf): void;
  /**
   * @public
   */
  getLastOpenFiles(): string[];

  /**
   * Calling this function will update/reconfigure the options of all markdown panes.
   * It is fairly expensive, so it should not be called frequently.
   * @public
   */
  updateOptions(): void;

  /**
   * @public
   */
  on(name: 'quick-preview', callback: (file: TFile, data: string) => any, ctx?: any): EventRef;
  /**
   * @public
   */
  on(name: 'resize', callback: () => any, ctx?: any): EventRef;

  /**
   * @public
   */
  on(name: 'active-leaf-change', callback: (leaf: WorkspaceLeaf | null) => any, ctx?: any): EventRef;
  /**
   * @public
   */
  on(name: 'file-open', callback: (file: TFile | null) => any, ctx?: any): EventRef;

  /**
   * @public
   */
  on(name: 'layout-change', callback: () => any, ctx?: any): EventRef;
  /**
   * @public
   */
  on(name: 'window-open', callback: (win: WorkspaceWindow, window: Window) => any, ctx?: any): EventRef;
  /**
   * @public
   */
  on(name: 'window-close', callback: (win: WorkspaceWindow, window: Window) => any, ctx?: any): EventRef;
  /**
   * Triggered when the CSS of the app has changed.
   * @public
   */
  on(name: 'css-change', callback: () => any, ctx?: any): EventRef;
  /**
   * Triggered when the user opens the context menu on a file.
   * @public
   */
  on(name: 'file-menu', callback: (menu: Menu, file: TAbstractFile, source: string, leaf?: WorkspaceLeaf) => any, ctx?: any): EventRef;
  /**
   * Triggered when the user opens the context menu with multiple files selected in the File Explorer.
   * @public
   */
  on(name: 'files-menu', callback: (menu: Menu, files: TAbstractFile[], source: string, leaf?: WorkspaceLeaf) => any, ctx?: any): EventRef;

  /**
   * Triggered when the user opens the context menu on an external URL.
   * @public
   */
  on(name: 'url-menu', callback: (menu: Menu, url: string) => any, ctx?: any): EventRef;
  /**
   * Triggered when the user opens the context menu on an editor.
   * @public
   */
  on(name: 'editor-menu', callback: (menu: Menu, editor: Editor, info: MarkdownView | MarkdownFileInfo) => any, ctx?: any): EventRef;
  /**
   * Triggered when changes to an editor has been applied, either programmatically or from a user event.
   * @public
   */
  on(name: 'editor-change', callback: (editor: Editor, info: MarkdownView | MarkdownFileInfo) => any, ctx?: any): EventRef;

  /**
   * Triggered when the editor receives a paste event.
   * Check for `evt.defaultPrevented` before attempting to handle this event, and return if it has been already handled.
   * Use `evt.preventDefault()` to indicate that you've handled the event.
   * @public
   */
  on(name: 'editor-paste', callback: (evt: ClipboardEvent, editor: Editor, info: MarkdownView | MarkdownFileInfo) => any, ctx?: any): EventRef;
  /**
   * Triggered when the editor receives a drop event.
   * Check for `evt.defaultPrevented` before attempting to handle this event, and return if it has been already handled.
   * Use `evt.preventDefault()` to indicate that you've handled the event.
   * @public
   */
  on(name: 'editor-drop', callback: (evt: DragEvent, editor: Editor, info: MarkdownView | MarkdownFileInfo) => any, ctx?: any): EventRef;

  /**
   * Triggered when the app is about to quit. Not guaranteed to actually run.
   * Perform some best effort cleanup here.
   * @public
   */
  on(name: 'quit', callback: (tasks: Tasks) => any, ctx?: any): EventRef;

}
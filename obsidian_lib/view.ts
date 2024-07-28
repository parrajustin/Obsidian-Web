import type { App } from "./app";
import { Component } from "./component";
import type { Scope } from "./control/scope";
import type { IconName } from "./icon_name";
import { ViewStateResult } from "./view_state_result";
import type { WorkspaceLeaf } from "./workspace/workspace_leaf";

/**
 * @public
 */
export abstract class View extends Component {
  /**
   * @public
   */
  app: App;
  /**
   * @public
   */
  icon: IconName;
  /**
   * Whether or not the view is intended for navigation.
   * If your view is a static view that is not intended to be navigated away, set this to false.
   * (For example: File explorer, calendar, etc.)
   * If your view opens a file or can be otherwise navigated, set this to true.
   * (For example: Markdown editor view, Kanban view, PDF view, etc.)
   *
   * @public
   */
  navigation: boolean;

  /**
   * @public
   */
  leaf: WorkspaceLeaf;
  /**
   * @public
   */
  containerEl: HTMLElement;
  /**
   * Assign an optional scope to your view to register hotkeys for when the view
   * is in focus.
   *
   * @example
   * ```ts
   * this.scope = new Scope(this.app.scope);
   * ```
   * @default null
   * @public
   */
  scope: Scope | null;
  /**
   * @public
   */
  constructor(leaf: WorkspaceLeaf);

  /**
   * @public
   */
  protected onOpen(): Promise<void>;
  /**
   * @public
   */
  protected onClose(): Promise<void>;
  /**
   * @public
   */
  abstract getViewType(): string;
  /**
   * @public
   */
  getState(): any;
  /**
   * @public
   */
  setState(state: any, result: ViewStateResult): Promise<void>;
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
  getIcon(): IconName;
  /**
   * Called when the size of this view is changed.
   * @public
   */
  onResize(): void;
  /**
   * @public
   */
  abstract getDisplayText(): string;
  /**
   * Populates the pane menu.
   *
   * (Replaces the previously removed `onHeaderMenu` and `onMoreOptionsMenu`)
   * @public
   */
  onPaneMenu(menu: Menu, source: 'more-options' | 'tab-header' | string): void;

}
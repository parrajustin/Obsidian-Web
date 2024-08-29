import { Component } from "../component";
import type { CloseableComponent } from "./closeable_component";

/**
 * @public
 */
export class Menu extends Component implements CloseableComponent {
  /**
   * @public
   */
  constructor();

  /**
   * @public
   */
  setNoIcon(): this;
  /**
   * Force this menu to use native or DOM.
   * (Only works on the desktop app)
   * @public
   */
  setUseNativeMenu(useNativeMenu: boolean): this;
  /**
   * Adds a menu item. Only works when menu is not shown yet.
   * @public
   */
  addItem(cb: (item: MenuItem) => any): this;
  /**
   * Adds a separator. Only works when menu is not shown yet.
   * @public
   */
  addSeparator(): this;

  /**
   * @public
   */
  showAtMouseEvent(evt: MouseEvent): this;
  /**
   * @public
   */
  showAtPosition(position: MenuPositionDef, doc?: Document): this;
  /**
   * @public
   */
  hide(): this;
  /** @public */
  close(): void;
  /**
   * @public
   */
  onHide(callback: () => any): void;
}

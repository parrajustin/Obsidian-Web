import type { CacheItem } from "./cache_item";

/**
 * @public
 */
export interface ListItemCache extends CacheItem {
  /**
   * The block ID of this list item, if defined.
   * @public
   */
  id?: string | undefined;
  /**
   * A single character indicating the checked status of a task.
   * The space character `' '` is interpreted as an incomplete task.
   * An other character is interpreted as completed task.
   * `undefined` if this item isn't a task.
   * @public
   */
  task?: string | undefined;
  /**
   * Line number of the parent list item (position.start.line).
   * If this item has no parent (e.g. it's a root level list),
   * then this value is the negative of the line number of the first list item (start of the list).
   *
   * Can be used to deduce which list items belongs to the same group (item1.parent === item2.parent).
   * Can be used to reconstruct hierarchy information (parentItem.position.start.line === childItem.parent).
   * @public
   */
  parent: number;
}

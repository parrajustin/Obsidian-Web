import type { CacheItem } from "./cache_item";

/**
 * @public
 */
export interface TagCache extends CacheItem {
  /**
   * @public
   */
  tag: string;
}

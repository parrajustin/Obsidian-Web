import type { CacheItem } from "./cache_item";

export interface HeadingCache extends CacheItem {
  /**
   * @public
   */
  heading: string;
  /**
   * @public
   */
  level: number;
}

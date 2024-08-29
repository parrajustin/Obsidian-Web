import type { CacheItem } from "./cache_item";

/**
 * @public
 */
export interface BlockCache extends CacheItem {
  /** @public */
  id: string;
}

import type { CacheItem } from "./cache_item";
import type { Reference } from "./reference";

/**
 * @public
 */
export interface ReferenceCache extends Reference, CacheItem {}

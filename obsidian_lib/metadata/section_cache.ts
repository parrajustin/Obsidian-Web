import type { CacheItem } from "./cache_item";

/**
 * @public
 */
export interface SectionCache extends CacheItem {
  /**
   * The block ID of this section, if defined.
   * @public
   */
  id?: string | undefined;
  /**
   * The type string generated by the parser.
   * @public
   */
  type: string;
}
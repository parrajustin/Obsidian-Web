import type { BlockCache } from "./block_cache";
import type { EmbedCache } from "./embed_cache";
import type { FootnoteCache } from "./footnote_cache";
import type { FrontMatterCache } from "./front_matter_cache";
import type { FrontmatterLinkCache } from "./frontmatter_link_cache";
import type { HeadingCache } from "./heading_cache";
import type { LinkCache } from "./link_cache";
import type { ListItemCache } from "./list_item_cache";
import type { Pos } from "./pos";
import type { SectionCache } from "./section_cache";
import type { TagCache } from "./tag_cache";

/**
 * @public
 */
export interface CachedMetadata {
  /**
   * @public
   */
  links?: LinkCache[];
  /**
   * @public
   */
  embeds?: EmbedCache[];
  /**
   * @public
   */
  tags?: TagCache[];
  /**
   * @public
   */
  headings?: HeadingCache[];
  /**
   * @public
   */
  footnotes?: FootnoteCache[];
  /**
   * Sections are root level markdown blocks, which can be used to divide the document up.
   * @public
   */
  sections?: SectionCache[];
  /**
   * @public
   */
  listItems?: ListItemCache[];
  /**
   * @public
   */
  frontmatter?: FrontMatterCache;
  /**
   * @public
   */
  frontmatterPosition?: Pos;

  /**
   * @public
   */
  frontmatterLinks?: FrontmatterLinkCache[];
  /**
   * @public
   */
  blocks?: Record<string, BlockCache>;
}

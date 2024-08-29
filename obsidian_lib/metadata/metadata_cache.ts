import { EventRef } from "../event_ref";
import { Events } from "../events";
import { TFile } from "../file_sytem/t_file";
import { CachedMetadata } from "./cached_metadata";

interface MetadataCacheApi {
  /**
   * Called when a file has been indexed, and its (updated) cache is now available.
   *
   * Note: This is not called when a file is renamed for performance reasons.
   * You must hook the vault rename event for those.
   * (Details: https://github.com/obsidianmd/obsidian-api/issues/77)
   * @public
   */
  on(
    name: "changed",
    callback: (file: TFile, data: string, cache: CachedMetadata) => unknown,
    ctx?: unknown
  ): EventRef;
  /**
   * Called when a file has been deleted. A best-effort previous version of the cached metadata is presented,
   * but it could be null in case the file was not successfully cached previously.
   * @public
   */
  on(
    name: "deleted",
    callback: (file: TFile, prevCache: CachedMetadata | null) => unknown,
    ctx?: unknown
  ): EventRef;

  /**
   * Called when a file has been resolved for `resolvedLinks` and `unresolvedLinks`.
   * This happens sometimes after a file has been indexed.
   * @public
   */
  on(name: "resolve", callback: (file: TFile) => unknown, ctx?: unknown): EventRef;
  /**
   * Called when all files has been resolved. This will be fired each time files get modified after the initial load.
   * @public
   */
  on(name: "resolved", callback: () => unknown, ctx?: unknown): EventRef;
}

/**
 *
 * Linktext is any internal link that is composed of a path and a subpath, such as "My note#Heading"
 * Linkpath (or path) is the path part of a linktext
 * Subpath is the heading/block ID part of a linktext.
 *
 * @public
 */
export class MetadataCache extends Events implements MetadataCacheApi {
  /**
   * Get the best match for a linkpath.
   * @public
   */
  getFirstLinkpathDest(linkpath: string, sourcePath: string): TFile | null;

  /**
   * @public
   */
  getFileCache(file: TFile): CachedMetadata | null;
  /**
   * @public
   */
  getCache(path: string): CachedMetadata | null;
  /**
   * Generates a linktext for a file.
   *
   * If file name is unique, use the filename.
   * If not unique, use full path.
   * @public
   */
  fileToLinktext(file: TFile, sourcePath: string, omitMdExtension?: boolean): string;

  /**
   * Contains all resolved links. This object maps each source file's path to an object of destination file paths with the link count.
   * Source and destination paths are all vault absolute paths that comes from `TFile.path` and can be used with `Vault.getAbstractFileByPath(path)`.
   * @public
   */
  resolvedLinks: Record<string, Record<string, number>>;
  /**
   * Contains all unresolved links. This object maps each source file to an object of unknown destinations with count.
   * Source paths are all vault absolute paths, similar to `resolvedLinks`.
   * @public
   */
  unresolvedLinks: Record<string, Record<string, number>>;
}

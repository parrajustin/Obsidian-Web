import type { DataWriteOptions } from "./data_write_options";
import type { ListedFiles } from "./listed_files";
import type { Stat } from "./stat";

/**
 * Work directly with files and folders inside a vault.
 * If possible prefer using the {@link Vault} API over this.
 * @public
 */
export interface DataAdapter {
  /**
   * @public
   */
  getName(): string;

  /**
   * Check if something exists at the given path.
   * @param normalizedPath - path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @param sensitive - Some file systems/operating systems are case-insensitive, set to true to force a case-sensitivity check.
   * @public
   */
  exists(normalizedPath: string, sensitive?: boolean): Promise<boolean>;
  /**
   * Retrieve metadata about the given file/folder.
   * @param normalizedPath - path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  stat(normalizedPath: string): Promise<Stat | null>;
  /**
   * Retrieve a list of all files and folders inside the given folder, non-recursive.
   * @param normalizedPath - path to folder, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  list(normalizedPath: string): Promise<ListedFiles>;
  /**
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  read(normalizedPath: string): Promise<string>;
  /**
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  readBinary(normalizedPath: string): Promise<ArrayBuffer>;
  /**
   * Write to a plaintext file.
   * If the file exists its content will be overwritten, otherwise the file will be created.
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @param data - new file content
   * @param options - (Optional)
   * @public
   */
  write(normalizedPath: string, data: string, options?: DataWriteOptions): Promise<void>;
  /**
   * Write to a binary file.
   * If the file exists its content will be overwritten, otherwise the file will be created.
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @param data - the new file content
   * @param options - (Optional)
   * @public
   */
  writeBinary(normalizedPath: string, data: ArrayBuffer, options?: DataWriteOptions): Promise<void>;
  /**
   * Add text to the end of a plaintext file.
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @param data - the text to append.
   * @param options - (Optional)
   * @public
   */
  append(normalizedPath: string, data: string, options?: DataWriteOptions): Promise<void>;
  /**
   * Atomically read, modify, and save the contents of a plaintext file.
   * @param normalizedPath - path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @param fn - a callback function which returns the new content of the file synchronously.
   * @param options - write options.
   * @returns string - the text value of the file that was written.
   * @public
   */
  process(
    normalizedPath: string,
    fn: (data: string) => string,
    options?: DataWriteOptions
  ): Promise<string>;
  /**
   * Returns an URI for the browser engine to use, for example to embed an image.
   * @param normalizedPath - path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  getResourcePath(normalizedPath: string): string;
  /**
   * Create a directory.
   * @param normalizedPath - path to use for new folder, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  mkdir(normalizedPath: string): Promise<void>;
  /**
   * Try moving to system trash.
   * @param normalizedPath - path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @returns Returns true if succeeded. This can fail due to system trash being disabled.
   * @public
   */
  trashSystem(normalizedPath: string): Promise<boolean>;
  /**
   * Move to local trash.
   * Files will be moved into the `.trash` folder at the root of the vault.
   * @param normalizedPath - path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  trashLocal(normalizedPath: string): Promise<void>;
  /**
   * Remove a directory.
   * @param normalizedPath - path to folder, use {@link normalizePath} to normalize beforehand.
   * @param recursive - If `true`, delete folders under this folder recursively, if `false` the folder needs to be empty.
   * @public
   */
  rmdir(normalizedPath: string, recursive: boolean): Promise<void>;
  /**
   * Delete a file.
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  remove(normalizedPath: string): Promise<void>;

  /**
   * Rename a file or folder.
   * @param normalizedPath - current path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @param normalizedNewPath - new path to file/folder, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  rename(normalizedPath: string, normalizedNewPath: string): Promise<void>;
  /**
   * Create a copy of a file.
   * This will fail if there is already a file at `normalizedNewPath`.
   * @param normalizedPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @param normalizedNewPath - path to file, use {@link normalizePath} to normalize beforehand.
   * @public
   */
  copy(normalizedPath: string, normalizedNewPath: string): Promise<void>;
}

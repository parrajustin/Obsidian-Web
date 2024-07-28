import { Events } from "../events";
import type { DataAdapter } from "./data_adapter";
import type { DataWriteOptions } from "./data_write_options";
import type { TAbstractFile } from "./t_abstract_file";
import type { TFile } from "./t_file";
import type { TFolder } from "./t_folder";

/**
 * Work with files and folders stored inside a vault.
 * @see {@link https://docs.obsidian.md/Plugins/Vault}
 * @public
 */
export class Vault extends Events {
  /**
   * @public
   */
  adapter: DataAdapter;

  /**
   * Gets the path to the config folder.
   * This value is typically `.obsidian` but it could be different.
   * @public
   */
  configDir: string;

  /**
   * Gets the name of the vault.
   * @public
   */
  getName(): string;

  /**
   * Get a file inside the vault at the given path.
   * Returns `null` if the file does not exist.
   *
   * @param path
   * @public
   */
  getFileByPath(path: string): TFile | null;
  /**
   * Get a folder inside the vault at the given path.
   * Returns `null` if the folder does not exist.
   *
   * @param path
   * @public
   */
  getFolderByPath(path: string): TFolder | null;
  /**
   * Get a file or folder inside the vault at the given path. To check if the return type is
   * a file, use `instanceof TFile`. To check if it is a folder, use `instanceof TFolder`.
   * @param path - vault absolute path to the folder or file, with extension, case sensitive.
   * @returns the abstract file, if it's found.
   * @public
   */
  getAbstractFileByPath(path: string): TAbstractFile | null;

  /**
   * Get the root folder of the current vault.
   * @public
   */
  getRoot(): TFolder;

  /**
   * Create a new plaintext file inside the vault.
   * @param path - Vault absolute path for the new file, with extension.
   * @param data - text content for the new file.
   * @param options - (Optional)
   * @public
   */
  create(path: string, data: string, options?: DataWriteOptions): Promise<TFile>;
  /**
   * Create a new binary file inside the vault.
   * @param path - Vault absolute path for the new file, with extension.
   * @param data - content for the new file.
   * @param options - (Optional)
   * @throws Error if file already exists
   * @public
   */
  createBinary(path: string, data: ArrayBuffer, options?: DataWriteOptions): Promise<TFile>;
  /**
   * Create a new folder inside the vault.
   * @param path - Vault absolute path for the new folder.
   * @throws Error if folder already exists
   * @public
   */
  createFolder(path: string): Promise<TFolder>;
  /**
   * Read a plaintext file that is stored inside the vault, directly from disk.
   * Use this if you intend to modify the file content afterwards.
   * Use {@link Vault.cachedRead} otherwise for better performance.
   * @public
   */
  read(file: TFile): Promise<string>;
  /**
   * Read the content of a plaintext file stored inside the vault
   * Use this if you only want to display the content to the user.
   * If you want to modify the file content afterward use {@link Vault.read}
   * @public
   */
  cachedRead(file: TFile): Promise<string>;
  /**
   * Read the content of a binary file stored inside the vault.
   * @public
   */
  readBinary(file: TFile): Promise<ArrayBuffer>;

  /**
   * Returns an URI for the browser engine to use, for example to embed an image.
   * @public
   */
  getResourcePath(file: TFile): string;
  /**
   * Deletes the file completely.
   * @param file - The file or folder to be deleted
   * @param force - Should attempt to delete folder even if it has hidden children
   * @public
   */
  delete(file: TAbstractFile, force?: boolean): Promise<void>;
  /**
   * Tries to move to system trash. If that isn't successful/allowed, use local trash
   * @param file - The file or folder to be deleted
   * @param system - Set to `false` to use local trash by default.
   * @public
   */
  trash(file: TAbstractFile, system: boolean): Promise<void>;
  /**
   * Rename or move a file.
   * @param file - the file to rename/move
   * @param newPath - vault absolute path to move file to.
   * @public
   */
  rename(file: TAbstractFile, newPath: string): Promise<void>;
  /**
   * Modify the contents of a plaintext file.
   * @param file - The file
   * @param data - The new file content
   * @param options - (Optional)
   * @public
   */
  modify(file: TFile, data: string, options?: DataWriteOptions): Promise<void>;
  /**
   * Modify the contents of a binary file.
   * @param file - The file
   * @param data - The new file content
   * @param options - (Optional)
   * @public
   */
  modifyBinary(file: TFile, data: ArrayBuffer, options?: DataWriteOptions): Promise<void>;
  /**
   * Add text to the end of a plaintext file inside the vault.
   * @param file - The file
   * @param data - the text to add
   * @param options - (Optional)
   * @public
   */
  append(file: TFile, data: string, options?: DataWriteOptions): Promise<void>;
  /**
   * Atomically read, modify, and save the contents of a note.
   * @param file - the file to be read and modified.
   * @param fn - a callback function which returns the new content of the note synchronously.
   * @param options - write options.
   * @returns string - the text value of the note that was written.
   * @public
   */
  process(file: TFile, fn: (data: string) => string, options?: DataWriteOptions): Promise<string>;
  /**
   * Create a copy of the selected file.
   * @param file - The file
   * @param newPath - Vault absolute path for the new copy.
   * @public
   */
  copy(file: TFile, newPath: string): Promise<TFile>;
  /**
   * Get all files and folders in the vault.
   * @public
   */
  getAllLoadedFiles(): TAbstractFile[];
  /**
   * Get all folders in the vault.
   * @param includeRoot - Should the root folder (`/`) be returned
   * @public
   */
  getAllFolders(includeRoot?: boolean): TFolder[];

  /**
   * @public
   */
  static recurseChildren(root: TFolder, cb: (file: TAbstractFile) => any): void;
  /**
   * Get all markdown files in the vault.
   * @public
   */
  getMarkdownFiles(): TFile[];
  /**
   * Get all files in the vault.
   * @public
   */
  getFiles(): TFile[];

  /**
   * Called when a file is created.
   * This is also called when the vault is first loaded for each existing file
   * If you do not wish to receive create events on vault load, register your event handler inside {@link Workspace.onLayoutReady}.
   * @public
   */
  on(name: 'create', callback: (file: TAbstractFile) => any, ctx?: any): EventRef;
  /**
   * Called when a file is modified.
   * @public
   */
  on(name: 'modify', callback: (file: TAbstractFile) => any, ctx?: any): EventRef;
  /**
   * Called when a file is deleted.
   * @public
   */
  on(name: 'delete', callback: (file: TAbstractFile) => any, ctx?: any): EventRef;
  /**
   * Called when a file is renamed.
   * @public
   */
  on(name: 'rename', callback: (file: TAbstractFile, oldPath: string) => any, ctx?: any): EventRef;

}
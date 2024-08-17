import type { FileSystemProvider } from "../../client/api/file_system_provider";
import { GetFileSystemProvider } from "../../client/api/file_system_provider";
import { Events } from "../events";
import type { DataAdapter } from "./data_adapter";
import type { DataWriteOptions } from "./data_write_options";
import type { TAbstractFile } from "./t_abstract_file";
import { TFile } from "./t_file";
import { TFolder } from "./t_folder";
import { NotFoundError, type StatusError } from "../../client/lib/status_error";
import type { Result } from "../../client/lib/result";
import { Err, Ok } from "../../client/lib/result";
import { logFailure } from "../../client/api/logger/resultLogger";
import { GetFileSystemNodeByPath } from "../../client/api/file_system_util";
import type { FileSystem } from "../../client/file_system/file_system";
import { ConvertToObsidianFolder, ValidatePathAnddGetParent } from "./conversion_util";

/**
 * Work with files and folders stored inside a vault.
 * @see {@link https://docs.obsidian.md/Plugins/Vault}
 * @public
 */
export class Vault extends Events {
  protected fileCache = new Map<TFile, string>();
  protected fileMap = new Map<string, TFile | TFolder>();

  private constructor(
    private fileSystemProvider: FileSystemProvider,
    fileSystem: FileSystem
  ) {
    super();

    const vaultFiles = ConvertToObsidianFolder(fileSystem.rootFolder, this, "/", null);
    const iterateFolder = (folder: TFolder) => {
      const children = folder.children;
      for (const child of children) {
        if (child instanceof TFile) {
          this.fileMap.set(child.path, child);
        }
        if (child instanceof TFolder) {
          this.fileMap.set(child.path, child);
          iterateFolder(child);
        }
      }
    };
    iterateFolder(vaultFiles);
  }

  /** Create the app vault file system class using the API file system providers. */
  static async CreateVault(fileSystemProviderName: string): Promise<Result<Vault, StatusError>> {
    const fileSystemProvider = GetFileSystemProvider(fileSystemProviderName);
    if (fileSystemProvider.none) {
      return Err(
        NotFoundError(`The file system provider "${fileSystemProviderName}" was not found.`)
      );
    }

    const initResult = await fileSystemProvider.safeValue().init();
    if (initResult.err) {
      return initResult;
    }

    const fileSystemResult = fileSystemProvider.safeValue().getFileSystem();
    if (fileSystemResult.err) {
      return fileSystemResult;
    }

    return Ok(new Vault(fileSystemProvider.safeValue(), fileSystemResult.safeUnwrap()));
  }

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
  public getName(): string {
    const name = this.fileSystemProvider.getName();
    if (name.err) {
      logFailure(name, "Vault.getName");
    }
    return name.unwrapOr("NO NAME FOUND");
  }

  /**
   * Get a file inside the vault at the given path.
   * Returns `null` if the file does not exist.
   *
   * @param path
   * @public
   */
  public getFileByPath(path: string): TFile | null {
    const file = this.fileMap.get(path);
    if (file instanceof TFolder || file === undefined) {
      return null;
    }
    return file;
  }
  /**
   * Get a folder inside the vault at the given path.
   * Returns `null` if the folder does not exist.
   *
   * @param path
   * @public
   */
  public getFolderByPath(path: string): TFolder | null {
    const folder = this.fileMap.get(path);
    if (folder instanceof TFile || folder === undefined) {
      return null;
    }
    return folder;
  }
  /**
   * Get a file or folder inside the vault at the given path. To check if the return type is
   * a file, use `instanceof TFile`. To check if it is a folder, use `instanceof TFolder`.
   * @param path - vault absolute path to the folder or file, with extension, case sensitive.
   * @returns the abstract file, if it's found.
   * @public
   */
  public getAbstractFileByPath(path: string): TAbstractFile | null {
    const abstractFile = this.fileMap.get(path);
    if (abstractFile === undefined) {
      return null;
    }
    return abstractFile;
  }

  /**
   * Get the root folder of the current vault.
   * @public
   */
  public getRoot(): TFolder {
    return this.fileMap.get("/") as TFolder;
  }

  /**
   * Create a new plaintext file inside the vault.
   * @param path - Vault absolute path for the new file, with extension.
   * @param data - text content for the new file.
   * @param options - (Optional)
   * @public
   */
  public create(path: string, data: string, options?: DataWriteOptions): Promise<TFile> {
    const enc = new TextEncoder(); // always utf-8
    const arrayBufferData = enc.encode(data);
    return this.createBinary(path, arrayBufferData, options);
  }
  /**
   * Create a new binary file inside the vault.
   * @param path - Vault absolute path for the new file, with extension.
   * @param data - content for the new file.
   * @param _options - (Optional)
   * @throws Error if file already exists
   * @public
   */
  public async createBinary(
    path: string,
    data: ArrayBuffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: DataWriteOptions
  ): Promise<TFile> {
    const parent = ValidatePathAnddGetParent(path, this);
    if (parent.err) {
      throw new Error(logFailure(parent, `Vault.createBinary`));
    }
    if (this.fileMap.get(path) !== undefined) {
      throw new Error("File alread exists.");
    }

    const result = await this.fileSystemProvider.writeFile(`/${path}`, data);
    if (result.err) {
      throw new Error(logFailure(result, `Vault.createBinary`));
    }

    const parentNode = parent.safeUnwrap();
    const baseName = parentNode.fullName.split(".")[0] as string;
    const extension = parentNode.fullName.split(".")[1];
    const newFile = new TFile();
    newFile.basename = baseName;
    newFile.extension = extension ?? "";
    newFile.name = parentNode.fullName;
    newFile.parent = parentNode.parent;
    let parentPath = `${parentNode.parentPath}/`;
    if (parentNode.parent.isRoot()) {
      parentPath = "";
    }
    newFile.path = `${parentPath}${parentNode.fullName}`;
    newFile.stat = {
      ctime: Date.now(),
      mtime: Date.now(),
      size: data.byteLength
    };
    newFile.vault = this;
    return newFile;
  }
  /**
   * Create a new folder inside the vault.
   * @param path - Vault absolute path for the new folder.
   * @throws Error if folder already exists
   * @public
   */
  public async createFolder(path: string): Promise<TFolder> {
    const parent = ValidatePathAnddGetParent(path, this);
    if (parent.err) {
      throw new Error(logFailure(parent, `Vault.createBinary`));
    }
    if (this.fileMap.get(path) !== undefined) {
      throw new Error("File alread exists.");
    }

    const result = await this.fileSystemProvider.createFolder(`/${path}`);
    if (result.err) {
      throw new Error(logFailure(result, `Vault.createBinary`));
    }

    const parentNode = parent.safeUnwrap();
    const newFolder = new TFolder(/*isRootFolder=*/ false, []);
    newFolder.name = parent.safeUnwrap().fullName;
    newFolder.parent = parent.safeUnwrap().parent;
    let parentPath = `${parentNode.parentPath}/`;
    if (parentNode.parent.isRoot()) {
      parentPath = "";
    }
    newFolder.path = `${parentPath}${parent.safeUnwrap().fullName}`;
    newFolder.vault = this;
    return newFolder;
  }
  /**
   * Read a plaintext file that is stored inside the vault, directly from disk.
   * Use this if you intend to modify the file content afterwards.
   * Use {@link Vault.cachedRead} otherwise for better performance.
   * @public
   */
  public async read(file: TFile): Promise<string> {
    const filePath = `/${file.path}`;
    const readFile = await this.fileSystemProvider.readFile(filePath);
    if (readFile.err) {
      logFailure(readFile, `Vault.read(${file.path})`);
      return "";
    }
    return readFile.safeUnwrap();
  }
  /**
   * Read the content of a plaintext file stored inside the vault
   * Use this if you only want to display the content to the user.
   * If you want to modify the file content afterward use {@link Vault.read}
   * @public
   */
  cachedRead(file: TFile): Promise<string> {
    return this.read(file);
  }
  /**
   * Read the content of a binary file stored inside the vault.
   * @public
   */
  readBinary(file: TFile): Promise<ArrayBuffer> {
    return this.read(file).then()
  }

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
  public getFiles(): TFile[] {
    const files: TFile[] = [];
    this.fileMap.forEach((node) => {
      if (node instanceof TFile) {
        files.push(node);
      }
    });
    return files;
  }
}

import type { FileSystem } from "../file_system/file_system";
import type { Option } from "../lib/option";
import { None, Some } from "../lib/option";
import type { Result, StatusResult } from "../lib/result";
import type { StatusError } from "../lib/status_error";

/** Api that provides the underlying file system. */
export abstract class FileSystemProvider {
  /** Initialize the file system provider. Called once on start. */
  abstract init(): Promise<StatusResult<StatusError>>;
  /** Gets the name of the vault. */
  abstract getName(): Result<string, StatusError>;
  /** Gets the full file system layout. Guarantees at least the root folder. */
  abstract getFileSystem(): Result<FileSystem, StatusError>;
  /**
   * Reads the full file data as an arraybuffer.
   * @param path the full file path to the file to read with `/` at start.
   */
  abstract readFileAsBuffer(path: string): Promise<Result<ArrayBuffer, StatusError>>;
  /**
   * Reads the full file data as a string.
   * @param path the full file path to the file to read with `/` at start.
   */
  abstract readFile(path: string): Promise<Result<string, StatusError>>;
  /**
   * Deletes the given file. Operation is saved till `saveChangesUpstream` is called.
   * @param path the full file path to the file to read with `/` at start.
   */
  abstract deleteFile(path: string): Promise<StatusResult<StatusError>>;
  /**
   * Writes the given file. Operation is saved till `saveChangesUpstream` is called.
   * @param path the full file path to the file to read with `/` at start.
   */
  abstract writeFile(path: string, data: ArrayBuffer): Promise<StatusResult<StatusError>>;
  /**
   * Create the folder with the given path..
   * @param path the full file path to the file to read with `/` at start.
   */
  abstract createFolder(path: string): Promise<StatusResult<StatusError>>;
  /**
   * Deletes the folder and all children recursively. Operation is saved till `saveChangesUpstream` is called.
   * @param path the full file path to the file to read with `/` at start.
   */
  abstract deleteFolder(path: string): Promise<StatusResult<StatusError>>;
}

type FileSystemProviderFactory = () => FileSystemProvider;
const registeredFileSystemProviders = new Map<string, FileSystemProviderFactory>();

export function RegisterFileSystemProvider(name: string, factory: FileSystemProviderFactory) {
  registeredFileSystemProviders.set(name, factory);
}
export function GetFileSystemProvider(name: string): Option<FileSystemProvider> {
  const factory = registeredFileSystemProviders.get(name);
  if (factory !== undefined) {
    return Some(factory());
  }
  return None;
}

import type { Option } from "client/lib/option";
import { None, Some } from "client/lib/option";
import type { Result, StatusResult } from "client/lib/result";
import type { StatusError } from "client/lib/status_error";

/** Api that provides the underlying file system. */
export abstract class FileSystemProvider {
  abstract init(): Promise<StatusResult<StatusError>>;
  abstract loadFileSystem(): Promise<Result<FileSystem, StatusError>>;
  abstract readFile(file: string): Promise<Result<string, StatusError>>;
  abstract deleteFile(file: string): Promise<StatusResult<StatusError>>;
  abstract writeFile(file: string): Promise<StatusResult<StatusError>>;
  abstract deleteFolder(file: string): Promise<StatusResult<StatusError>>;
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

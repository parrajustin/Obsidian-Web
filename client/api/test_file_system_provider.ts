import type { StatusResult, Result } from "client/lib/result";
import { Err } from "client/lib/result";
import type { StatusError } from "client/lib/status_error";
import { UnimplementedError } from "client/lib/status_error";
import { FileSystemProvider, RegisterFileSystemProvider } from "./file_system_provider";

class TestFileSystemProvider extends FileSystemProvider {
  public async init(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public async loadFileSystem(): Promise<Result<FileSystem, StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public async readFile(): Promise<Result<string, StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public async deleteFile(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public async writeFile(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public async deleteFolder(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
}
RegisterFileSystemProvider("test", () => new TestFileSystemProvider());

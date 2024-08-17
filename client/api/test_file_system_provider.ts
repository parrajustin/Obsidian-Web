import type { StatusResult, Result } from "client/lib/result";
import { Err } from "client/lib/result";
import type { StatusError } from "client/lib/status_error";
import { UnimplementedError } from "client/lib/status_error";
import { FileSystemProvider, RegisterFileSystemProvider } from "./file_system_provider";
import type { FileSystem } from "client/file_system/file_system";

class TestFileSystemProvider extends FileSystemProvider {
  public override async init(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public override async getFileSystem(): Promise<Result<FileSystem, StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public override async readFile(): Promise<Result<string, StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public override async deleteFile(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public override async writeFile(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
  public override async deleteFolder(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("Test file system provider unimplemented."));
  }
}
RegisterFileSystemProvider("test", () => new TestFileSystemProvider());

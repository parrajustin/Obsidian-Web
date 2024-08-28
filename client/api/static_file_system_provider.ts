import type { StatusResult, Result } from "../lib/result";
import { Err, Ok } from "../lib/result";
import { StatusError } from "../lib/status_error";
import {
  InternalError,
  InvalidArgumentError,
  NotFoundError,
  UnimplementedError,
  UnknownError
} from "../lib/status_error";
import { FileSystemProvider, RegisterFileSystemProvider } from "./file_system_provider";
import type { FileSystem } from "../file_system/file_system";
import type { Option } from "../lib/option";
import { None, Some } from "../lib/option";
import { WrapPromise } from "../lib/wrap_promise";
import { Fork } from "../lib/functional/fork";
import { GetFileSystemNodeByPath } from "./file_system_util";

export class StaticFileSystemProvider extends FileSystemProvider {
  private underlyingData: Option<FileSystem> = None;

  public override async init(): Promise<StatusResult<StatusError>> {
    // First fetch the file system layout json.
    // TODO: Remove hard coded local ip.
    const data = await WrapPromise(
      fetch("http://localhost:9000/file.json").then((val) => val.json() as Promise<FileSystem>)
    );

    // Wrap up the underlying data and return the operation's status.
    return data
      .andThen((val) => {
        this.underlyingData = Some(val);
        return Ok(null);
      })
      .mapErr((err): StatusError => {
        console.error("StaticFileSystemProvider err", err);
        return InternalError("Unknown Error");
      });
  }

  public override getName(): Result<string, StatusError> {
    // Getting name requires the underlying filesystem.
    if (this.underlyingData.none) {
      return Err(InternalError("The file system hasn't been initialized!"));
    }

    return Ok(this.underlyingData.safeValue().name);
  }

  public override getFileSystem(): Result<FileSystem, StatusError> {
    if (this.underlyingData.some) {
      return Ok(this.underlyingData.safeValue());
    }
    return Err(NotFoundError("There is no underlying filesystem."));
  }

  private async readFileFromFileSystem<T>(
    path: string,
    conversion: (r: Response) => Promise<T>
  ): Promise<Result<T, StatusError>> {
    const nodeResult = GetFileSystemNodeByPath(path, this);
    if (nodeResult.err) {
      return nodeResult;
    }
    const node = nodeResult.safeUnwrap();
    if (node.none) {
      return Err(NotFoundError(`Failed to find file "${path}".`));
    }
    if (node.safeValue().type === "Folder") {
      return Err(InvalidArgumentError(`File path "${path}" lead to a folder.`));
    }

    // Now try to get the file. Wrap the fetching of the file within a Result.
    const forkOnResponse = Fork(
      (r: Response) => r.ok && r.status === 200,
      /*trueFunc=*/ (r: Response) => conversion(r),
      /*falseFunc=*/ (r: Response) =>
        Promise.resolve(UnknownError(`Server failure: (${r.status}: ${r.statusText})`))
    );
    const forkOnFetchReturnType = Fork(
      (s: StatusError | T) => s instanceof StatusError,
      /*trueFunc=*/ (s: StatusError) => Err(s),
      /*falseFunc=*/ (s: T) => Ok(s)
    );
    return (
      (
        await WrapPromise<StatusError | T>(
          // Fetches `file` and gets the text body.
          fetch(`http://localhost:9000/vault${path}`).then<T | StatusError>(forkOnResponse)
        )
      )
        .andThen(forkOnFetchReturnType)
        // Only executed if the `fetc\h` function failed. This converts whatever the error may be to
        // a StatusError.
        .mapErr<StatusError>((err) =>
          InternalError(`Failed when trying to fetch "${path}".`).with((statusError) => {
            if (err instanceof Error) {
              statusError.setPayload("FetchError", err.toString());
            } else {
              statusError.setPayload("FetchError", `[data]: ${err}`);
            }
          })
        )
    );
  }

  public override async readFileAsBuffer(path: string): Promise<Result<ArrayBuffer, StatusError>> {
    return this.readFileFromFileSystem<ArrayBuffer>(path, (r: Response) => r.arrayBuffer());
  }

  public override async readFile(path: string): Promise<Result<string, StatusError>> {
    return this.readFileFromFileSystem<string>(path, (r: Response) => r.text());
  }
  public override async createFolder(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("'StaticFileSystemProvider' doesn't implement createFolder."));
  }
  public override async deleteFile(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("'StaticFileSystemProvider' doesn't implement deleteFile."));
  }
  public override async writeFile(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("'StaticFileSystemProvider' doesn't implement writeFile."));
  }
  public override async deleteFolder(): Promise<StatusResult<StatusError>> {
    return Err(UnimplementedError("'StaticFileSystemProvider' doesn't implement deleteFolder."));
  }
}
RegisterFileSystemProvider("static", () => new StaticFileSystemProvider());

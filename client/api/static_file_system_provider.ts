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
import type { File, FileSystem, Folder } from "../file_system/file_system";
import type { Option } from "../lib/option";
import { None, Some } from "../lib/option";
import { WrapPromise } from "../lib/wrap_promise";
import { IdentityMonad } from "../lib/functional/identity";
import { Fork } from "../lib/functional/fork";
import { GetFileSystemNodeByPath } from "./file_system_util";

export class StaticFileSystemProvider extends FileSystemProvider {
  createFolder(path: string): Promise<StatusResult<StatusError>> {
    throw new Error("Method not implemented.");
  }
  private underlyingData: Option<FileSystem> = None;

  public override async init(): Promise<StatusResult<StatusError>> {
    const data = await WrapPromise(
      fetch("http://localhost:9000/file.json").then((val) => val.json() as Promise<FileSystem>)
    );

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
    if (this.underlyingData.none) {
      return Err(InternalError("The file system hasn't been initialized!"));
    }

    return Ok(this.underlyingData.safeValue().name);
  }

  public override getFileSystem(): Result<FileSystem, StatusError> {
    if (this.underlyingData.some) {
      return Ok(this.underlyingData.safeValue());
    }
    return Err(NotFoundError("The underlying is empty."));
  }

  public override async readFile(file: string): Promise<Result<string, StatusError>> {
    const nodeResult = GetFileSystemNodeByPath(file, this);
    if (nodeResult.err) {
      return nodeResult;
    }
    const node = nodeResult.safeUnwrap();
    if (node.none) {
      return Err(NotFoundError(`Failed to find file "${file}".`));
    }
    if (node.safeValue().type === "Folder") {
      return Err(InvalidArgumentError(`File path "${file}" lead to a folder.`));
    }

    // From response get the string text file.
    const getString = (r: Response) => r.text();
    // Now try to get the file. Wrap the fetching of the file within a Result.
    const forkOnResponse = Fork(
      (r: Response) => r.ok && r.status === 200,
      /*trueFunc=*/ (r: Response) => getString(r),
      /*falseFunc=*/ (r: Response) =>
        Promise.resolve(UnknownError(`Server failure: (${r.status}: ${r.statusText})`))
    );
    const forkOnFetchReturnType = Fork(
      (s: StatusError | string) => s instanceof StatusError,
      /*trueFunc=*/ (s: StatusError) => Err(s),
      /*falseFunc=*/ (s: string) => Ok(s)
    );
    return (
      (
        await WrapPromise<StatusError | string>(
          // Fetches `file` and gets the text body.
          fetch(`http://localhost:9000/vault${file}`).then<string | StatusError>(forkOnResponse)
        )
      )
        .andThen(forkOnFetchReturnType)
        // Only executed if the `fetc\h` function failed. This converts whatever the error may be to
        // a StatusError.
        .mapErr<StatusError>((err) =>
          InternalError(`Failed when trying to fetch "${file}".`).with((statusError) => {
            if (err instanceof Error) {
              statusError.setPayload("FetchError", err.toString());
            } else {
              statusError.setPayload("FetchError", `[data]: ${err}`);
            }
          })
        )
    );
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
  saveChangesUpstream(): Promise<StatusResult<StatusError>> {
    throw new Error("Method not implemented.");
  }
}
RegisterFileSystemProvider("static", () => new StaticFileSystemProvider());

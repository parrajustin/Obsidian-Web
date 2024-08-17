import type { File, Folder } from "../file_system/file_system";
import { IdentityMonad } from "../lib/functional/identity";
import type { Option } from "../lib/option";
import { None, Some } from "../lib/option";
import type { Result } from "../lib/result";
import { Ok } from "../lib/result";
import type { StatusError } from "../lib/status_error";
import type { FileSystemProvider } from "./file_system_provider";

/** Gets the file system node for a given path. ("File" or "Folder") */
export function GetFileSystemNodeByPath(
  path: string,
  fileSystemProvider: FileSystemProvider
): Result<Option<File | Folder>, StatusError> {
  const fileSystem = fileSystemProvider.getFileSystem();
  if (fileSystem.err) {
    return fileSystem;
  }

  const split = (seperator: string) => (x: string) => x.split(seperator);
  const splitFile = split("/");
  const removeEmpty = (arg: string[]) => arg.filter((x) => x.length > 0);
  // Get just the split data path "/this/is/a/path" => ["this", "is", "a", "path"].
  const filePath = IdentityMonad.of(path).map(splitFile).map(removeEmpty).val();

  // First lets check if the file exists.]

  // Checks through the filesystem nodes to find the file.
  let currentIter: Folder | File | undefined = fileSystem.safeUnwrap().rootFolder;
  for (let i = 0; i < filePath.length && currentIter !== undefined; i++) {
    if (currentIter.type === "File") {
      currentIter = undefined;
      break;
    }
    currentIter = currentIter.children[filePath[i] as string];
  }
  if (currentIter === undefined) {
    return Ok(None);
  }

  return Ok(Some(currentIter));
}

import type { File, Folder } from "../../client/file_system/file_system";
import { None, Option, Some } from "../../client/lib/option";
import { Err, Ok, Result } from "../../client/lib/result";
import { InvalidArgumentError, StatusError } from "../../client/lib/status_error";
import type { TAbstractFile } from "./t_abstract_file";
import { TFile } from "./t_file";
import { TFolder } from "./t_folder";
import type { Vault } from "./vault";

/**
 * Converts the file to obisidian file.
 * @param file client file interface
 * @param vault vault class
 * @param path the path to the file not including the file
 * @param parent the parent folder
 * @returns TFile
 */
export function ConvertToObsidianFile(
  file: File,
  vault: Vault,
  path: string,
  parent: TFolder
): TFile {
  const tFile = new TFile();
  tFile.basename = file.name;
  tFile.extension = file.extension;
  tFile.stat = {
    ctime: file.stats.ctime,
    mtime: file.stats.mtime,
    size: file.stats.size
  };
  tFile.vault = vault;
  tFile.path = `${path}/${file.name}.${file.extension}`;
  tFile.name = `${file.name}.${file.extension}`;
  tFile.parent = parent;
  return tFile;
}

/**
 * Converts the folder to obisidian folder.
 * @param folder client folder interface
 * @param vault vault class
 * @param path the path to the folder not including itself
 * @param parent the parent folder
 * @returns TFolder
 */
export function ConvertToObsidianFolder(
  folder: Folder,
  vault: Vault,
  path: string,
  parent: TFolder | null
): TFolder {
  const isRoot = folder.isRoot ?? false;
  const tFolder = new TFolder(isRoot, []);
  const children: TAbstractFile[] = [];
  for (const child of Object.keys(folder.children)) {
    const node = folder.children[child];
    if (node === undefined) {
      continue;
    }
    if (node.type === "File") {
      children.push(
        ConvertToObsidianFile(node, vault, isRoot ? `` : `${path}${folder.name}/`, tFolder)
      );
    }
    if (node.type === "Folder") {
      children.push(
        ConvertToObsidianFolder(node, vault, isRoot ? `` : `${path}${folder.name}/`, tFolder)
      );
    }
  }
  tFolder.children = children;
  tFolder.vault = vault;
  tFolder.parent = parent;
  // TODO: Only the root folder has the leading / in obsidian.
  tFolder.path = isRoot ? "/" : `${path}${folder.name}`;
  return tFolder;
}

interface ValidatedPath {
  parent: TFolder;
  fullName: string;
  parentPath: string;
}

/**
 * Validates the path and get the obsidian folder node.
 * @param path full obsidian style path including the file/folder in question.
 * @param vault obisdian style vault api.
 * @returns None if there is no parent, folder if found.
 */
export function ValidatePathAnddGetParent(
  path: string,
  vault: Vault
): Result<ValidatedPath, StatusError> {
  if (path.charAt(0) === "/") {
    return Err(
      InvalidArgumentError(`non-absolute style filepath ValidatePathAnddGetParent("${path}").`)
    );
  }
  const splitPath = path.split("/");
  if (splitPath.length === 0) {
    return Err(InvalidArgumentError(`path is wrong for ValidatePathAnddGetParent("${path}").`));
  }
  const fullName = splitPath.pop();
  if (fullName === undefined) {
    // Should be impossible.
    return Err(InvalidArgumentError(`no fullName for ValidatePathAnddGetParent("${path}").`));
  }
  const parentPath = (splitPath.length === 0 ? ["/"] : splitPath).join("/");
  const parentNode = vault.getFolderByPath(parentPath);
  if (parentNode === null) {
    return Err(InvalidArgumentError(`no parent found ValidatePathAnddGetParent("${path}").`));
  }
  return Ok({ parent: parentNode, fullName, parentPath });
}

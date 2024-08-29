import type { Keymap, UserEvent } from "./control/keymap";
import type { Scope } from "./control/scope";
import type { FileManager } from "./file_sytem/file_manager";
import type { Vault } from "./file_sytem/vault";
import type { MetadataCache } from "./metadata/metadata_cache";
import type { Workspace } from "./workspace/workspace";

/**
 * @public
 */
export class App {
  /** @public */
  keymap: Keymap;
  /** @public */
  scope: Scope;

  /** @public */
  workspace: Workspace;

  /** @public */
  vault: Vault;
  /** @public */
  metadataCache: MetadataCache;

  /** @public */
  fileManager: FileManager;

  /**
   * The last known user interaction event, to help commands find out what modifier keys are pressed.
   * @public
   */
  lastEvent: UserEvent | null;
}

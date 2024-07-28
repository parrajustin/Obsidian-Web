/**
 * Manage the creation, deletion and renaming of files from the UI.
 * @public
 */
export class FileManager {

  /**
   * Gets the folder that new files should be saved to, given the user's preferences.
   * @param sourcePath - The path to the current open/focused file,
   * used when the user wants new files to be created "in the same folder".
   * Use an empty string if there is no active file.
   * @param newFilePath - The path to the file that will be newly created,
   * used to infer what settings to use based on the path's extension.
   * @public
   */
  getNewFileParent(sourcePath: string, newFilePath?: string): TFolder;

  /**
   * Rename or move a file safely, and update all links to it depending on the user's preferences.
   * @param file - the file to rename
   * @param newPath - the new path for the file
   * @public
   */
  renameFile(file: TAbstractFile, newPath: string): Promise<void>;

  /**
   * Remove a file or a folder from the vault according the user's preferred 'trash'
   * options (either moving the file to .trash/ or the OS trash bin).
   * @param file
   * @public
   */
  trashFile(file: TAbstractFile): Promise<void>;
  /**
   * Generate a markdown link based on the user's preferences.
   * @param file - the file to link to.
   * @param sourcePath - where the link is stored in, used to compute relative links.
   * @param subpath - A subpath, starting with `#`, used for linking to headings or blocks.
   * @param alias - The display text if it's to be different than the file name. Pass empty string to use file name.
   * @public
   */
  generateMarkdownLink(file: TFile, sourcePath: string, subpath?: string, alias?: string): string;

  /**
   * Atomically read, modify, and save the frontmatter of a note.
   * The frontmatter is passed in as a JS object, and should be mutated directly to achieve the desired result.
   *
   * Remember to handle errors thrown by this method.
   *
   * @param file - the file to be modified. Must be a markdown file.
   * @param fn - a callback function which mutates the frontmatter object synchronously.
   * @param options - write options.
   * @throws YAMLParseError if the YAML parsing fails
   * @throws any errors that your callback function throws
   * @public
   */
  processFrontMatter(file: TFile, fn: (frontmatter: any) => void, options?: DataWriteOptions): Promise<void>;

  /**
   * Resolves a unique path for the attachment file being saved.
   * Ensures that the parent directory exists and dedupes the
   * filename if the destination filename already exists.
   *
   * @param filename Name of the attachment being saved
   * @param sourcePath The path to the note associated with this attachment, defaults to the workspace's active file.
   * @returns Full path for where the attachment should be saved, according to the user's settings
   * @public
   */
  getAvailablePathForAttachment(filename: string, sourcePath?: string): Promise<string>;
}
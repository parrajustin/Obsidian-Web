export interface Stats {
  /**
   * Time of creation, represented as a unix timestamp.
   * @public
   * */
  ctime: number;
  /**
   * Time of last modification, represented as a unix timestamp.
   * @public
   */
  mtime: number;
  /**
   * Size on disk, as bytes.
   * @public
   */
  size: number;
}

export interface File {
  type: "File";
  stats: Stats;
  name: string;
  extension: string;
}

export interface Folder {
  type: "Folder";
  children: Record<string, Folder | File>;
  name: string;
  isRoot?: boolean;
}

export interface FileSystem {
  rootFolder: Folder;
  plugins: string[];
  name: string;
}

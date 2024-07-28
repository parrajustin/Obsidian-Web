/** @public */
export interface Stat {
  /** @public */
  type: "file" | "folder";
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

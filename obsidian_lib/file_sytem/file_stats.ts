/**
 * @public
 */
export interface FileStats {
  /**
   * Time of creation, represented as a unix timestamp, in milliseconds.
   * @public
   */
  ctime: number;
  /**
   * Time of last modification, represented as a unix timestamp, in milliseconds.
   * @public
   */
  mtime: number;
  /**
   * Size on disk, as bytes.
   * @public
   */
  size: number;
}

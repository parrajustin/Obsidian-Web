/**
 * @public
 */
export interface Reference {
  /**
   * @public
   */
  link: string;
  /**
   * @public
   */
  original: string;
  /**
   * if title is different than link text, in the case of [[page name|display name]]
   * @public
   */
  displayText?: string;
}

import { TAbstractFile } from "./t_abstract_file";

/**
 * @public
 */
export class TFolder extends TAbstractFile {
  constructor(
    private isRootFolder: boolean,
    public children: TAbstractFile[]
  ) {
    super();
  }

  /**
   * @public
   */
  public isRoot(): boolean {
    return this.isRootFolder;
  }
}

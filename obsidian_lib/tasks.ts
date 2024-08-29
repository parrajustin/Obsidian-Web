/**
 * @public
 */
export class Tasks {
  private promises: Promise<unknown>[] = [];

  /**
   * @public
   */
  add(callback: () => Promise<unknown>): void {
    this.promises.push(callback());
  }
  /**
   * @public
   */
  addPromise(promise: Promise<unknown>): void {
    this.promises.push(promise);
  }
  /**
   * @public
   */
  isEmpty(): boolean {
    return this.promises.length == 0;
  }
  /**
   * @public
   */
  promise(): Promise<unknown> {
    return Promise.all(this.promises);
  }
}

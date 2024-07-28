/**
 * @public
 */
export class EventRef {
  private disabled = false;

  constructor(
    private deRef: () => void,
    public callback: (...args: unknown[]) => unknown
  ) {}

  /** Disable the event ref and it's callback. */
  public disableEventRef() {
    if (!this.disabled) {
      this.deRef();
    }
    this.disabled = true;
  }

  public get isDisabled(): boolean {
    return this.disabled;
  }
}

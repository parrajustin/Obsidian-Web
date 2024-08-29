/**
 * A closeable component that can get dismissed via the Android 'back' button.
 * @public
 */
export interface CloseableComponent {
  /** @public */
  close(): unknown;
}

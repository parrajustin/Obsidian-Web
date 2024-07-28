/**
 * Metadata about a Community plugin.
 * @see {@link https://docs.obsidian.md/Reference/Manifest}
 * @public
 */
export interface PluginManifest {
  /**
   * Vault path to the plugin folder in the config directory.
   * @public
   */
  dir?: string;
  /**
   * The plugin ID.
   * @public
   */
  id: string;
  /**
   * The display name.
   * @public
   */
  name: string;
  /**
   * The author's name.
   * @public
   */
  author: string;
  /**
   * The current version, using {@link https://semver.org/ Semantic Versioning}.
   * @public
   */
  version: string;
  /**
   * The minimum required Obsidian version to run this plugin.
   * @public
   */
  minAppVersion: string;
  /**
   * A description of the plugin.
   * @public
   */
  description: string;
  /**
   * A URL to the author's website.
   * @public
   */
  authorUrl?: string;

  /**
   * Whether the plugin can be used only on desktop.
   * @public
   */
  isDesktopOnly?: boolean;
};

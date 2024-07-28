import type { App } from "./app";
import { Component } from "./component";
import type { IconName } from "./icon_name";
import type { PluginManifest } from "./plugin_manifest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Extension = any;

/**
 * @public
 */
export abstract class Plugin extends Component {
  /**
   * @public
   */
  constructor(
    public app: App,
    public manifest: PluginManifest
  ) {
    super();
  }
  /**
   * Adds a ribbon icon to the left bar.
   * @param icon - The icon name to be used. See {@link addIcon}
   * @param title - The title to be displayed in the tooltip.
   * @param callback - The `click` callback.
   * @public
   */
  addRibbonIcon(icon: IconName, title: string, callback: (evt: MouseEvent) => any): HTMLElement;
  /**
   * Adds a status bar item to the bottom of the app.
   * Not available on mobile.
   * @see {@link https://docs.obsidian.md/Plugins/User+interface/Status+bar}
   * @return HTMLElement - element to modify.
   * @public
   */
  addStatusBarItem(): HTMLElement;
  /**
   * Register a command globally.
   * Registered commands will be available from the @{link https://help.obsidian.md/Plugins/Command+palette Command pallete}.
   * The command id and name will be automatically prefixed with this plugin's id and name.
   * @public
   */
  addCommand(command: Command): Command;
  /**
   * Register a settings tab, which allows users to change settings.
   * @see {@link https://docs.obsidian.md/Plugins/User+interface/Settings#Register+a+settings+tab}
   * @public
   */
  addSettingTab(settingTab: PluginSettingTab): void;
  /**
   * @public
   */
  registerView(type: string, viewCreator: ViewCreator): void;
  /**
   * Registers a view with the 'Page preview' core plugin as an emitter of the 'hover-link' on the event.
   * @public
   */
  registerHoverLinkSource(id: string, info: HoverLinkSource): void;
  /**
   * @public
   */
  registerExtensions(extensions: string[], viewType: string): void;
  /**
   * Registers a post processor, to change how the document looks in reading mode.
   * @see {@link https://docs.obsidian.md/Plugins/Editor/Markdown+post+processing}
   * @public
   */
  registerMarkdownPostProcessor(
    postProcessor: MarkdownPostProcessor,
    sortOrder?: number
  ): MarkdownPostProcessor;
  /**
   * Register a special post processor that handles fenced code given a language and a handler.
   * This special post processor takes care of removing the `<pre><code>` and create a `<div>` that
   * will be passed to the handler, and is expected to be filled with custom elements.
   * @see {@link https://docs.obsidian.md/Plugins/Editor/Markdown+post+processing#Post-process+Markdown+code+blocks}
   * @public
   */
  registerMarkdownCodeBlockProcessor(
    language: string,
    handler: (
      source: string,
      el: HTMLElement,
      ctx: MarkdownPostProcessorContext
    ) => Promise<any> | void,
    sortOrder?: number
  ): MarkdownPostProcessor;

  /**
   * Registers a CodeMirror 6 extension.
   * To reconfigure cm6 extensions for a plugin on the fly, an array should be passed in, and modified dynamically.
   * Once this array is modified, calling {@link Workspace.updateOptions} will apply the changes.
   * @param extension - must be a CodeMirror 6 `Extension`, or an array of Extensions.
   * @public
   */
  registerEditorExtension(extension: Extension): void {
    throw new Error(`[Plugin.registerEditorExtension] Unimplemented ${JSON.stringify(extension)}`);
  }
  /**
   * Register a handler for obsidian:// URLs.
   * @param action - the action string. For example, "open" corresponds to `obsidian://open`.
   * @param handler - the callback to trigger. A key-value pair that is decoded from the query will be passed in.
   *                  For example, `obsidian://open?key=value` would generate `{"action": "open", "key": "value"}`.
   * @public
   */
  registerObsidianProtocolHandler(action: string, handler: ObsidianProtocolHandler): void;
  /**
   * Register an EditorSuggest which can provide live suggestions while the user is typing.
   * @public
   */
  registerEditorSuggest(editorSuggest: EditorSuggest<any>): void;
  /**
   * Load settings data from disk.
   * Data is stored in `data.json` in the plugin folder.
   * @see {@link https://docs.obsidian.md/Plugins/User+interface/Settings}
   * @public
   */
  loadData(): Promise<any>;
  /**
   * Write settings data to disk.
   * Data is stored in `data.json` in the plugin folder.
   * @see {@link https://docs.obsidian.md/Plugins/User+interface/Settings}
   * @public
   */
  saveData(data: any): Promise<void>;

  /**
   * Called when the `data.json` file is modified on disk externally from Obsidian.
   * This usually means that a Sync service or external program has modified
   * the plugin settings.
   *
   * Implement this method to reload plugin settings when they have changed externally.
   *
   * @public
   */
  public abstract onExternalSettingsChange(): unknown;
}

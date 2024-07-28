import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("obsidian-element")
export class ObsidianElement extends LitElement {
  static styles = css`
    #main-container {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex: 1 0 0;
    }

    .left-ribbon {
      width: 44px;
    }

    .left-leaf {
      margin-left: 1px;
    }

    .main {
      flex: 1 0 auto;
    }
  `;

  protected render() {
    return html`
      <div id="main-container">
        <web-left-ribbon class="left-ribbon"></web-left-ribbon>
        <web-left-leaf class="left-leaf"></web-left-leaf>
        <main-body class="main"></main-body>
        <web-right-leaf></web-right-leaf>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "obsidian-element": ObsidianElement;
  }
}

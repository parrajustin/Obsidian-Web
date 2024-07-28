import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("web-left-leaf")
export class WebLeftLeaf extends LitElement {
  static styles = css`
    .vertical-container {
      min-width: 200px;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex: 1 0 0;
      flex-direction: row;
      justify-content: center;
      background-color: #262626;
    }
  `;

  protected render() {
    return html`<div class="vertical-container">left</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "web-left-leaf": WebLeftLeaf;
  }
}

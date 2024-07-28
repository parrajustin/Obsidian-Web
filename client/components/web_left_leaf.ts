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
      flex-direction: column;
      background-color: #262626;
    }
    .vertical-container::before {
      content: "";
      top: 0px;
      left: 45px;
      position: absolute;
      background-color: #36364d;
      width: 200px;
      height: 39px;
      z-index: 0;
    }
    .header {
      width: 100%;
      height: 44px;
      z-index: 1;
    }
  `;

  protected render() {
    return html`
      <div class="vertical-container">
        <div class="header">header</div>
        <div>body</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "web-left-leaf": WebLeftLeaf;
  }
}

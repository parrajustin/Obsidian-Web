import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("web-right-leaf")
export class WebRightLeaf extends LitElement {
  static styles = css``;

  protected render() {
    return html`<div>right</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "web-right-leaf": WebRightLeaf;
  }
}

import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("main-body")
export class MainBody extends LitElement {
  static styles = css``;

  protected render() {
    return html`<div>main</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "main-body": MainBody;
  }
}

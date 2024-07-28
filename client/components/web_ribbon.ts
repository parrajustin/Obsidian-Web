import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { createElement, PanelLeftClose, Terminal } from "lucide";

@customElement("web-left-ribbon")
export class WebLeftRibbon extends LitElement {
  static styles = css`
    .vertical-container {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex: 1 0 0;
      flex-direction: column;
      align-items: center;
      background-color: #262626;
      border-right: 1rem solid #36364d;
    }
    .vertical-container::before {
      content: "";
      top: 0px;
      left: 0px;
      position: absolute;
      background-color: #36364d;
      width: 44px;
      height: 44px;
      z-index: 0;
    }
    .header {
      padding: 8px 0 8px 0;
      color: white;
      z-index: 1;
    }
    .side-doc-actions {
      margin-top: 8px;
    }
    .action {
      color: white;
      padding-bottom: 4px;
    }
  `;

  protected render() {
    return html`
      <div class="vertical-container">
        <div class="header">${createElement(PanelLeftClose)}</div>
        <div class="side-doc-actions">
          <div class="action">${createElement(Terminal)}</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "web-left-ribbon": WebLeftRibbon;
  }
}

import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageStyle } from '@app/styles/page.style';

@customElement('app-home-page')
export class AppHomePage extends LitElement {
  static styles = [
    pageStyle,
    css`
      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      h3 {
        margin: 0 0 10px 0;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    setPageTitle('Home');
  }

  protected firstUpdated() {}

  render() {
    return html``;
  }
}

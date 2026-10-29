import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageStyle } from '@app/styles/page.style';

@customElement('app-not-found-page')
export class AppNotFoundPage extends LitElement {
  static styles = [
    pageStyle,
    css`
      h1 {
        text-align: center;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    setPageTitle('404');
  }

  render() {
    return html`<h1>Page not found</h1>`;
  }
}

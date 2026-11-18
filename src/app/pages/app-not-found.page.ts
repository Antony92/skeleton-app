import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageStyle } from '@app/styles/page.style';

@customElement('app-not-found-page')
export class AppNotFoundPage extends LitElement {
  static override styles = [
    pageStyle,
    css`
      h1 {
        text-align: center;
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();
    setPageTitle('404');
  }

  override render() {
    return html`<h1>Page not found</h1>`;
  }
}

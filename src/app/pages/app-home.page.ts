import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@app/elements/tree/app-tree.element';
import '@app/elements/tree-item/app-tree-item.element';
import type { AppSelect } from '@app/elements/select/app-select.element';

@customElement('app-home-page')
export class AppHomePage extends LitElement {
  static styles = [
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
    return html`
      <app-tree @app-select=${(event: AppSelect) => console.log(event.value)}>
        <app-tree-item expanded value="electronics">
          Electronics
          <app-tree-item expanded value="computers">
            Computers
            <app-tree-item value="laptops">Laptops</app-tree-item>
            <app-tree-item value="desktops">Desktops</app-tree-item>
            <app-tree-item value="tablets">Tablets</app-tree-item>
          </app-tree-item>
          <app-tree-item value="phones">
            Phones
            <app-tree-item value="smartphones">Smartphones</app-tree-item>
            <app-tree-item value="accessories">Accessories</app-tree-item>
          </app-tree-item>
        </app-tree-item>
        <app-tree-item value="clothing">
          Clothing
          <app-tree-item value="shirts">Shirts</app-tree-item>
          <app-tree-item value="pants">Pants</app-tree-item>
          <app-tree-item value="shoes">Shoes</app-tree-item>
        </app-tree-item>
        <app-tree-item value="books">Books</app-tree-item>
      </app-tree>
    `;
  }
}

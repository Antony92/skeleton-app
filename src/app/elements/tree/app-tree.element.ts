import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { AppTreeItem } from '@app/elements/tree-item/app-tree-item.element';
import { AppSelectEvent } from '@app/events/select.event';

@customElement('app-tree')
export class AppTree extends LitElement {
  static styles = [
    defaultStyle,
    css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    `,
  ];

  @property({ type: String })
  accessor selection: 'leaf' | 'multiple' = 'leaf';

  @property({ type: Boolean })
  accessor disabled = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('app-change', async (event) => {
      event.stopPropagation();
      const allTreeItems = Array.from(this.querySelectorAll<AppTreeItem>('app-tree-item'));
      await Promise.all(allTreeItems.map((item) => item.updateComplete));
      const selectedTreeItems = allTreeItems.filter((item) => item.selected);
      const value = selectedTreeItems
        .map((item) => item.value)
        .filter(Boolean)
        .join(', ');
      this.dispatchEvent(new AppSelectEvent(value));
    });
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (['selection', 'disabled'].some((prop) => _changedProperties.has(prop))) {
      const allTreeItems = this.querySelectorAll<AppTreeItem>('app-tree-item');
      allTreeItems.forEach((item) => {
        item.selection = this.selection;
        item.disabled = this.disabled;
      });
    }
  }

  render() {
    return html`
      <div class="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-tree': AppTree;
  }
}

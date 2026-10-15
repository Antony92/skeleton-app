import { appTagStyle } from '@app/elements/tag/app-tag.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

@customElement('app-tag')
export class AppTag extends LitElement {
  static styles = [
    defaultStyle,
    focusStyle,
    appTagStyle,
    css`
      :host {
        --border: var(--theme-default-background);
        --background: color-mix(in srgb, var(--theme-default-background) 20%, transparent);
        --color: var(--theme-color);
      }
    `,
  ];

  @property({ type: String })
  accessor variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

  @property({ type: Boolean })
  accessor pill = false;

  @property({ type: Boolean })
  accessor removable = false;

  onRemove() {
    if (!this.dispatchEvent(new Event('app-remove', { cancelable: true }))) {
      return;
    }
  }

  render() {
    return html`
      <div part="tag" class=${classMap({ removable: this.removable, pill: this.pill })}>
        <slot></slot>
        ${when(this.removable, () => html`<button class="remove" @click=${this.onRemove}>✕</button>`)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-tag': AppTag;
  }
}

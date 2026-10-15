import { appChipStyle } from '@app/elements/chip/app-chip.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

@customElement('app-chip')
export class AppChip extends LitElement {
  static styles = [defaultStyle, focusStyle, appChipStyle, css``];

  @property({ type: String })
  accessor value = '';

  @property({ type: Boolean, reflect: true })
  accessor active = false;

  @property({ type: Boolean })
  accessor disabled = false;

  @property({ type: Boolean })
  accessor removable = false;

  onRemove(event: Event) {
    if (!this.dispatchEvent(new Event('app-remove', { cancelable: true }))) {
      event.stopPropagation();
      return;
    }
  }

  render() {
    return html`
      <div>
        <button
          part="chip"
          ?disabled=${this.disabled}
          class="${classMap({ 'focus-visible': true, active: this.active, chip: true, removable: this.removable })}"
          @click=${() => (this.active = !this.active)}
        >
          <slot></slot>
        </button>
        ${when(this.removable, () => html`<button class="remove" @click=${this.onRemove} ?disabled=${this.disabled}>✕</button>`)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-chip': AppChip;
  }
}

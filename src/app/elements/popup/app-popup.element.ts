import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('app-popup')
export class AppPopup extends LitElement {
  static styles = [
    defaultStyle,
    css`
      .container {
        anchor-name: --anchor;
        width: fit-content;
      }

      [popover] {
        inset: auto;
        margin: 0;
        position-anchor: --anchor;
        min-width: anchor-size(width);
        position-area: bottom span-all;
        position-try: flip-block;
        position-visibility: anchors-visible;
        margin-top: 5px;
        border: 1px solid var(--theme-default-color);
        background: var(--theme-default-surface);
        border-radius: var(--radius-2);
        overflow: auto;
        padding: 5px;
        white-space: nowrap;
        box-shadow: var(--shadow-4);

        &:popover-open {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
      }
    `,
  ];

  @query('[popover]')
  accessor popup!: HTMLElement;

  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @property({ type: String })
  accessor behaviour: 'auto' | 'manual' = 'auto';

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.assignedSlot?.name === 'trigger') {
        event.stopPropagation();
        this.toggle();
      } else if (target.hasAttribute('app-popup-close')) {
        event.stopPropagation();
        this.close();
      }
    });
  }

  protected firstUpdated() {
    this.popup.addEventListener('toggle', (event: Event) => {
      const toggleEvent = event as ToggleEvent;
      if (toggleEvent.newState === 'closed') {
        this.close();
      }
    });
  }

  close() {
    if (!this.dispatchEvent(new Event('app-close', { cancelable: true }))) {
      return;
    }
    this.open = false;
    this.popup.hidePopover();
    this.popup.removeAttribute('style');
  }

  async show() {
    if (!this.dispatchEvent(new Event('app-show', { cancelable: true }))) {
      return;
    }
    this.open = true;
    await this.updateComplete;
    this.popup.showPopover();
  }

  toggle() {
    if (!this.open) {
      void this.show();
    } else {
      this.close();
    }
  }

  render() {
    return html`
      <div class="container">
        <slot name="trigger"></slot>
        <div part="popover" popover=${this.behaviour}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-popup': AppPopup;
  }
}

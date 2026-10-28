import { appDialogStyle } from '@app/elements/dialog/app-dialog.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

@customElement('app-dialog')
export class AppDialog extends LitElement {
  static styles = [
    defaultStyle,
    appDialogStyle,
    focusStyle,
    css`
      :host {
        display: contents;
      }
    `,
  ];

  @property({ type: String })
  accessor header = '';

  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @property({ type: Boolean })
  accessor modal = false;

  @property({ type: Boolean })
  accessor fullscreen = false;

  @property({ type: Boolean, attribute: 'show-close-button' })
  accessor showHideButton = true;

  @query('dialog')
  accessor dialog!: HTMLDialogElement;

  #returnValue: string | undefined = '';

  get returnValue() {
    return this.#returnValue;
  }

  protected firstUpdated() {
    this.dialog.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      if (target.hasAttribute('app-dialog-close')) {
        void this.close(target.getAttribute('app-dialog-close') || '');
        return;
      }

      if (target instanceof HTMLDialogElement === false) {
        return;
      }

      if (this.modal) {
        void this.pulseAnimation();
      } else {
        void this.close();
      }
    });

    this.dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      void this.close();
    });
  }

  async show() {
    if (!this.dispatchEvent(new Event('app-show', { cancelable: true }))) {
      return;
    }
    this.open = true;
    await this.updateComplete;
    this.dialog.showModal();
    await this.openAnimation();
    this.querySelector<HTMLElement>('[autofocus]')?.focus();
    this.dispatchEvent(new Event('app-after-show'));
  }

  async close(value?: string) {
    this.#returnValue = value;
    if (!this.dispatchEvent(new Event('app-close', { cancelable: true }))) {
      return;
    }
    await this.updateComplete;
    await this.openAnimation(true);
    this.dialog.close(value);
    this.open = false;
    this.dispatchEvent(new Event('app-after-close'));
  }

  openAnimation(reverse = false) {
    const animation = this.dialog.animate(
      [
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1 },
      ],
      {
        direction: reverse ? 'reverse' : 'normal',
        duration: 200,
        fill: 'both',
      },
    );
    return animation.finished;
  }

  pulseAnimation() {
    const animation = this.dialog.animate([{ scale: 1 }, { scale: 1.02 }, { scale: 1 }], {
      duration: 250,
      fill: 'both',
    });
    return animation.finished;
  }

  render() {
    return html`
      <dialog>
        <div class="container">
          <header>
            <slot name="header">
              <h3>${this.header}</h3>
            </slot>
            ${when(this.showHideButton, () => html`<button class="focus-visible" @click=${this.close}>✕</button>`)}
          </header>
          <article>
            <slot></slot>
          </article>
          <footer>
            <slot name="footer"></slot>
          </footer>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-dialog': AppDialog;
  }
}

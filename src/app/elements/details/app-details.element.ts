import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-details')
export class AppDetails extends LitElement {
  static styles = [
    defaultStyle,
    focusStyle,
    css`
      :host {
        width: 100%;
      }

      details {
        border-radius: var(--radius-2);
        border: 1px solid var(--theme-muted-color);
        interpolate-size: allow-keywords;

        &::details-content {
          opacity: 0;
          block-size: 0;
          overflow-y: clip;
          transition:
            content-visibility 250ms allow-discrete,
            opacity 250ms,
            block-size 250ms;
        }

        &[open]::details-content {
          opacity: 1;
          block-size: auto;
        }

        &[open] {
          summary .caret {
            rotate: 90deg;
          }
        }

        summary {
          display: flex;
          cursor: pointer;
          padding: 16px;

          .caret {
            margin-left: auto;
            transition: 250ms rotate ease;
            transform-box: fill-box;
            display: flex;
            align-items: center;

            svg {
              height: 1em;
              overflow: visible;
              width: auto;
            }
          }
        }

        .content {
          padding: 16px;
        }
      }
    `,
  ];

  @property({ type: Boolean })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @property({ type: String })
  accessor summary = '';

  @property({ type: String })
  accessor name = '';

  connectedCallback() {
    super.connectedCallback();
  }

  toggle(event: Event) {
    const target = event.target as HTMLDetailsElement;
    if (target !== event.currentTarget) return;
    this.open = target.open;
    if (this.open && this.name) {
      const root = this.getRootNode() as Document | ShadowRoot;
      root.querySelectorAll<AppDetails>(`app-details[name="${this.name}"]`).forEach((detail) => {
        if (detail !== this && detail.open) {
          detail.open = false;
        }
      });
    }
  }

  render() {
    return html`
      <details
        part="details"
        ?disabled=${this.disabled}
        ?open=${this.open}
        class="focus-visible"
        @toggle=${this.toggle}
      >
        <summary part="summary">
          <slot name="summary">${this.summary}</slot>
          <span class="caret">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              part="svg"
              fill="currentColor"
            >
              <path
                d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
              ></path>
            </svg>
          </span>
        </summary>
        <div class="content" part="content">
          <slot></slot>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-details': AppDetails;
  }
}

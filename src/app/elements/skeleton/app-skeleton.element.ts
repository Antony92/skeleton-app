import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-skeleton')
export class AppSkeleton extends LitElement {
  static styles = [
    defaultStyle,
    css`
      :host {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 1rem;
        --color: light-dark(#e4e5e9, #2f323f);
        --sheen-color: color-mix(in oklab, var(--color), light-dark(white, #1b1d26));
      }

      div {
        flex: 1 1 auto;
        background: #2f323f;
        border-radius: var(--radius-round);
      }

      .sheen {
        background: linear-gradient(
          270deg,
          var(--sheen-color),
          var(--color),
          var(--color),
          var(--sheen-color)
        );
        background-size: 400% 100%;
        animation: 8s ease-in-out 0s infinite normal none running sheen;
      }

      .pulse {
        opacity: 1;
        animation: 2s ease-in-out 0.5s infinite normal none running pulse;
      }

      @keyframes sheen {
        0% {
          background-position: 200% 0px;
        }

        100% {
          background-position: -200% 0px;
        }
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }

        50% {
          opacity: 0.4;
        }

        100% {
          opacity: 1;
        }
      }
    `,
  ];

  @property({ type: String })
  accessor effect: 'pulse' | 'sheen' | 'none' = 'sheen';

  render() {
    return html`<div part="skeleton" class="${this.effect}"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-skeleton': AppSkeleton;
  }
}

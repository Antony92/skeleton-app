import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

@customElement('app-dropdown-item')
export class AppDropdownItem extends LitElement {
	static styles = [
		defaultStyle,
		css`
			::slotted(app-icon) {
				font-size: 20px;
			}

			:host {
				color: var(--theme-color);
			}

			:host([variant='primary']) {
				color: var(--theme-primary-color);
			}

			:host([variant='success']) {
				color: var(--theme-success-color);
			}

			:host([variant='warning']) {
				color: var(--theme-warning-color);
			}

			:host([variant='error']) {
				color: var(--theme-error-color);
			}

			button,
			a {
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: 10px;
				border: none;
				padding: 10px;
				white-space: nowrap;
				height: 36px;
				width: 100%;
				background: none;
				text-decoration: none;
				font-family: var(--theme-font-family);
				font-size: var(--theme-font-size-1);
				border-radius: var(--radius-2);
				color: inherit;

				.prefix {
					display: flex;
					align-items: center;
				}

				&:not(:disabled, :focus-visible):hover {
					background: var(--theme-muted-background);
				}

				&:focus-visible {
					background: var(--theme-primary-background);
					color: var(--theme-white-color);
					outline: none;
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		`,
	];

	@property({ type: Boolean })
	accessor disabled = false;

	@property({ type: String })
	accessor value = '';

	@property({ type: String })
	accessor href = '';

	@property({ type: String })
	accessor variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', (event) => {
			if (event.defaultPrevented) return;
			this.dispatchEvent(new Event('app-dropdown-item-click', { bubbles: true, composed: true }));
		});
	}

	render() {
		return html`
			${when(
				this.href,
				() => html`
					<a part="item" href=${this.href}>
						<span class="prefix">
							<slot name="prefix"></slot>
						</span>
						<slot></slot>
					</a>
				`,
				() => html`
					<button part="item" ?disabled=${this.disabled} .value=${this.value}>
						<span class="prefix">
							<slot name="prefix"></slot>
						</span>
						<slot></slot>
					</button>
				`,
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dropdown-item': AppDropdownItem;
	}
}

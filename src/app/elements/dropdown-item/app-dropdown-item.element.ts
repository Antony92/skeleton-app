import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-dropdown-item')
export class AppDropdownItem extends LitElement {
	static styles = [
		css`
			::slotted(app-icon) {
				font-size: 20px;
			}

			button {
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: 10px;
				border: none;
				padding: 10px;
				white-space: nowrap;
				height: 36px;
				font-size: inherit;
				width: 100%;
				color: light-dark(var(--gray-8), var(--gray-4));
				background: none;

				.prefix {
					display: flex;
					align-items: center;
				}

				&:not(:disabled, :focus-visible):hover {
					background: light-dark(var(--gray-4), var(--gray-8));
				}

				&:focus-visible {
					background: var(--theme-primary-background);
					color: var(--theme-white-color);
					outline: none;
					border-radius: 0;
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		`,
	]

	@property({ type: Boolean })
	disabled = false

	@property({ type: String })
	value = ''

	render() {
		return html`
			<button part="item" ?disabled=${this.disabled} .value=${this.value}>
				<span class="prefix">
					<slot name="prefix"></slot>
				</span>
				<slot></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dropdown-item': AppDropdownItem
	}
}

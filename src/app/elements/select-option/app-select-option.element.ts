import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

@customElement('app-select-option')
export class AppSelectOption extends LitElement {
	static styles = [
		css`
			:host {
				min-width: max-content;
				width: auto;
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

				&:not(:disabled, :focus-visible, :focus-within):hover {
					background: light-dark(var(--gray-4), var(--gray-8));
				}

				&:focus-visible,
				&:focus-within {
					background: var(--theme-primary-background);
					color: var(--theme-white-color);
					outline: none;
					border-radius: 0;
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				svg {
					width: auto;
					height: 100%;
					flex-shrink: 0;
				}
			}
		`,
	]

	@property({ type: Boolean })
	disabled = false

	@property({ type: String })
	value = ''

	@property({ type: Boolean, reflect: true })
	selected = false

	@query('button')
	option!: HTMLButtonElement

	focus(options?: FocusOptions) {
		this.option?.focus(options)
	}

	render() {
		return html`
			<button part="option" ?disabled=${this.disabled} .value=${this.value} ?selected=${this.selected}>
				${when(
					this.selected,
					() => html`
						<svg part="checked-icon svg" viewBox="0 0 16 16">
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
								<g stroke="currentColor">
									<g transform="translate(3.428571, 3.428571)">
										<path d="M0,5.71428571 L3.42857143,9.14285714"></path>
										<path d="M9.14285714,0 L3.42857143,9.14285714"></path>
									</g>
								</g>
							</g>
						</svg>
					`,
				)}
				<slot></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-select-option': AppSelectOption
	}
}

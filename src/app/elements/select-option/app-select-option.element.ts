import { defaultStyle } from '@app/styles/default.style'
import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

@customElement('app-select-option')
export class AppSelectOption extends LitElement {
	static styles = [
		defaultStyle,
		css`
			:host {
				min-width: max-content;
				width: auto;
			}

			button {
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: 5px;
				border: none;
				padding: 10px 5px;
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
					visibility: hidden;
					width: auto;
					height: 100%;
					flex-shrink: 0;

					&.visible {
						visibility: visible;
					}
				}
			}
		`,
	]

	@property({ type: Boolean })
	accessor disabled = false

	@property({ type: String })
	accessor value = ''

	@property({ type: Boolean, reflect: true })
	accessor selected = false

	@query('button')
	accessor option!: HTMLButtonElement

	focus(options?: FocusOptions) {
		this.option?.focus(options)
	}

	render() {
		return html`
			<button part="option" ?disabled=${this.disabled} .value=${this.value} ?selected=${this.selected}>
				<svg part="checked-icon svg" viewBox="0 0 16 16" class=${classMap({ visible: this.selected })}>
					<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
						<g stroke="currentColor">
							<g transform="translate(3.428571, 3.428571)">
								<path d="M0,5.71428571 L3.42857143,9.14285714"></path>
								<path d="M9.14285714,0 L3.42857143,9.14285714"></path>
							</g>
						</g>
					</g>
				</svg>
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

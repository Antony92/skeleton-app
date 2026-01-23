import { defaultStyle } from '@app/styles/default.style'
import { focusStyle } from '@app/styles/focus.style'
import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

@customElement('app-tab')
export class AppTab extends LitElement {
	static styles = [
		defaultStyle,
		focusStyle,
		css`
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
				font-weight: 600;
				width: 100%;
				color: light-dark(var(--gray-8), var(--gray-4));
				background: none;
				border-bottom: 2px solid transparent;
				position: relative;
				top: 2px;

				&:not(:disabled):hover {
					color: var(--theme-primary-color);
				}

				&.active {
					color: var(--theme-primary-color);
					border-bottom: solid 2px var(--theme-primary-color);
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		`,
	]

	@property({ type: Boolean, reflect: true })
	accessor disabled = false

	@property({ type: Boolean, reflect: true })
	accessor active = false

	@property({ type: String })
	accessor panel = ''

	render() {
		return html`
			<button part="tab" ?disabled=${this.disabled} class="${classMap({ active: this.active, ['focus-visible']: true })}">
				<slot></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tab': AppTab
	}
}

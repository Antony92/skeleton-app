import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appButtonStyle } from './app-button.style'

@customElement('app-button')
export class AppButton extends LitElement {
	static styles = [appButtonStyle, css``]

	@property({ type: String, reflect: true })
	variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'icon' | 'text' = 'primary'

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean, reflect: true })
	autofocus = false

	@property({ type: Boolean, reflect: true })
	hidden = false

	render() {
		return html`
			<button part="button" class=${this.variant} ?disabled=${this.disabled} ?autofocus=${this.autofocus} ?hidden=${this.hidden}>
				<slot></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-button': AppButton
	}
}

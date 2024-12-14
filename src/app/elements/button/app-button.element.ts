import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appButtonStyle } from './app-button.style'
import { classMap } from 'lit/directives/class-map.js'

@customElement('app-button')
export class AppButton extends LitElement {
	static styles = [appButtonStyle, css``]

	@property({ type: String, reflect: true })
	variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary'

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean, reflect: true })
	autofocus = false

	@property({ type: Boolean, reflect: true })
	hidden = false

	@property({ type: Boolean, reflect: true })
	outlined = false

	@property({ type: Boolean, reflect: true })
	text = false

	@property({ type: Boolean, reflect: true })
	icon = false

	render() {
		return html`
			<button
				part="button"
				class="${classMap({ [this.variant]: true, outlined: this.outlined, text: this.text, icon: this.icon })}"
				?disabled=${this.disabled}
				?autofocus=${this.autofocus}
				?hidden=${this.hidden}
			>
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

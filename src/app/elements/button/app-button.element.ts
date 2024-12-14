import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appButtonStyle } from './app-button.style'
import { classMap } from 'lit/directives/class-map.js'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-button')
export class AppButton extends LitElement {
	static styles = [appButtonStyle, focusStyle, css``]

	@property({ type: String, reflect: true })
	variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default'

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
				role="button"
				class="${classMap({ [this.variant]: true, outlined: this.outlined, text: this.text, icon: this.icon, ['focus-visible']: true })}"
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

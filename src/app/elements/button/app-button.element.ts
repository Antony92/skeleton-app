import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appButtonStyle } from '@app/elements/button/app-button.style'
import { focusStyle } from '@app/styles/focus.style'
import { when } from 'lit/directives/when.js'
import { defaultStyle } from '@app/styles/default.style'
import { ifDefined } from 'lit/directives/if-defined.js'

@customElement('app-button')
export class AppButton extends LitElement {
	static styles = [
    defaultStyle,
		appButtonStyle,
		focusStyle,
		css`
			:host {
				--background: var(--theme-default-background);
				--color: var(--theme-white-color);
			}
		`,
	]

	@property({ type: String })
	variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default'

	@property({ type: String })
	appearance: 'normal' | 'outlined' | 'plain' = 'normal'

	@property({ type: Boolean })
	disabled = false

	@property({ type: Boolean })
	outlined = false

	@property({ type: Boolean })
	text = false

	@property({ type: Boolean })
	icon = false

	@property({ type: String })
	href = ''

	@property({ type: String })
	download: string | undefined

	render() {
		return html`
			${when(
				this.href,
				() => html`
					<a
						part="button"
						role="button"
						class="focus-visible"
						href=${this.href}
						download=${ifDefined(this.download)}
						?autofocus=${this.autofocus}
					>
						<slot></slot>
					</a>
				`,
				() => html`
					<button
						part="button"
						role="button"
						class="focus-visible"
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
					>
						<slot></slot>
					</button>
				`,
			)}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-button': AppButton
	}
}

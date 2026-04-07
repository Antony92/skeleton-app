import { html, LitElement, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { focusStyle } from '@app/styles/focus.style'
import { defaultStyle } from '@app/styles/default.style'
import { appCopyButtonStyle } from '@app/elements/copy-button/app-copy-button.style'
import '@app/elements/icon/app-icon.element'

@customElement('app-copy-button')
export class AppCopyButton extends LitElement {
	static styles = [
		defaultStyle,
		appCopyButtonStyle,
		focusStyle,
		css`
			:host {
				--color: var(--theme-primary-color);
			}
		`,
	]

	@property({ type: Boolean })
	accessor disabled = false

	@property({ type: String })
	accessor value = ''

	@state()
	accessor copied = false

	private timeout = 0

	async copy() {
		if (this.copied) return
		clearTimeout(this.timeout)
		await navigator.clipboard.writeText(this.value)
		this.copied = true
		setTimeout(() => (this.copied = false), 1000)
	}

	render() {
		return html`
			<button part="button" role="button" class="focus-visible" ?disabled=${this.disabled} ?autofocus=${this.autofocus} @click=${this.copy}>
				<div class="copy" ?hidden=${this.copied}>
					<slot name="copy-icon">
						<app-icon>content_copy</app-icon>
					</slot>
				</div>
				<div class="success" ?hidden=${!this.copied}>
					<slot name="success-icon">
						<app-icon>check</app-icon>
					</slot>
				</div>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-copy-button': AppCopyButton
	}
}

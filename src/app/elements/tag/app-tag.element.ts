import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appTagStyle } from '@app/elements/tag/app-tag.style'
import { classMap } from 'lit/directives/class-map.js'
import { defaultStyle } from '@app/styles/default.style'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-tag')
export class AppTag extends LitElement {
	static styles = [defaultStyle, focusStyle, appTagStyle, css``]

	@property({ type: String })
	accessor value = ''

	@property({ type: Boolean })
	accessor active = false

	@property({ type: Boolean })
	accessor disabled = false

	render() {
		return html`
			<button
				part="tag"
				?disabled=${this.disabled}
				class="${classMap({ 'focus-visible': true, active: this.active })}"
				@click=${() => (this.active = !this.active)}
			>
				<slot></slot>
			</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tag': AppTag
	}
}

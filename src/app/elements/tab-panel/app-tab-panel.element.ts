import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

@customElement('app-tab-panel')
export class AppTabPanel extends LitElement {
	static styles = [css``]

	@property({ type: Boolean })
	active = false

	@property({ type: String })
	name = ''
	
	render() {
		return html`
			${when(
				this.active,
				() => html`
					<div part="panel">
						<slot></slot>
					</div>
				`
			)}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tab-panel': AppTabPanel
	}
}

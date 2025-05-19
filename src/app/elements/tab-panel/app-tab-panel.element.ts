import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-tab-panel')
export class AppTabPanel extends LitElement {
	static styles = [
		css`
			:host {
				display: none;
			}

			:host([active]) {
				display: block;
				width: 100%;
			}
		`,
	]

	@property({ type: Boolean })
	active = false

	@property({ type: String })
	name = ''

	render() {
		return html`
			<div part="panel">
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tab-panel': AppTabPanel
	}
}

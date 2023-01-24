import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-table-body')
export class AppTableBody extends LitElement {
	static styles = css`
		:host {
            display: table-row-group;
        }
		::slotted(app-table-row:not(:last-child)) {
			border-bottom: 1px solid grey;
		}
		::slotted(app-table-row:first-child) {
			border-top: 1px solid grey;
		}
	`

	override render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-body': AppTableBody
	}
}
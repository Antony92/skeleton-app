import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-table-row')
export class AppTableRow extends LitElement {
	static styles = css`
		:host {
            display: table-row;
        }
	`

	override render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-row': AppTableRow
	}
}
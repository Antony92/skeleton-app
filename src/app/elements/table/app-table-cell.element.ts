import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-table-cell')
export class AppTableCell extends LitElement {
	static styles = css`
		:host {
            display: table-cell;
			padding: 10px 20px;
        }
	`

	override render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-cell': AppTableCell
	}
}

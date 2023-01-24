import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-table-head')
export class AppTableHead extends LitElement {
	static styles = css`
		:host {
            display: table-row-group;
        }
	`

	override render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-head': AppTableHead
	}
}
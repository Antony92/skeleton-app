import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-table-cell')
export class AppTableCell extends LitElement {
	static styles = css`
		:host {
			display: table-cell;
			white-space: nowrap;
			padding: 10px 20px;
		}

		:host([textWrap]) {
			white-space: normal;
		}

		:host([textlimit]) {
			max-width: var(--textlimit, 300px);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		:host([noresult]) {
			max-width: 1px;
			overflow: visible;
			white-space: nowrap;
		}

		:host([sticky]) {
			position: sticky;
			left: var(--sticky-start, -1px);
			z-index: 1;
			background-color: var(--theme-background);
		}

		:host([stickyEnd]) {
			position: sticky;
			right: var(--sticky-end, -1px);
			z-index: 1;
			background-color: var(--theme-background);
		}
	`

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-cell': AppTableCell
	}
}

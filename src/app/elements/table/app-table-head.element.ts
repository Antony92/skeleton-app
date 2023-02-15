import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { AppTableHeading } from './app-table-heading.element'

@customElement('app-table-head')
export class AppTableHead extends LitElement {
	static styles = css`
		:host {
            display: table-header-group;
        }
	`

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('app-table-column-filter-order', (event) => {
			const { target, detail: { order }} = (<CustomEvent>event)
			if (order) {
				this.headings
				.filter(heading => heading !== target)
				.forEach(heading => heading.clearOrderFilter())
			}
		})
	}

	get headings() {
		const slot = this.renderRoot.querySelector('slot')
		const headings = (<HTMLSlotElement>slot)?.assignedElements().filter((node) => node.matches('app-table-heading'))
		return Array.from(headings || []) as AppTableHeading[]
	}

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-head': AppTableHead
	}
}
import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/dropdown/app-dropdown.component'

@customElement('app-home-page')
export class AppHomePage extends LitElement {
	static styles = [
		css`
			img {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	]

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Home')
	}

	protected firstUpdated() {}

	render() {
		return html`
			<app-dropdown>
				<button slot="trigger">Dropdown</button>
			</app-dropdown>
		`
	}
}

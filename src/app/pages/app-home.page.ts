import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/dropdown/app-dropdown.element'
import '@app/elements/dropdown-item/app-dropdown-item.element'
import '@app/elements/icon/app-icon.element'

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
				<app-dropdown-item value="1">
					<app-icon slot="prefix">save</app-icon>
					Save
				</app-dropdown-item>
				<app-dropdown-item value="1">
					<app-icon slot="prefix">save</app-icon>
					Save
				</app-dropdown-item>
				<app-dropdown-item value="1">
					<app-icon slot="prefix">save</app-icon>
					Save
				</app-dropdown-item>
				<app-dropdown-item value="1">
					<app-icon slot="prefix">save</app-icon>
					Save
				</app-dropdown-item>

				<app-dropdown-item value="1">
					<app-icon slot="prefix">save</app-icon>
					Save
				</app-dropdown-item>
				<app-dropdown-item value="1">
					<app-icon slot="prefix">save</app-icon>
					Save
				</app-dropdown-item>
				<app-dropdown-item disabled>
					<app-icon slot="prefix">delete</app-icon>
					Delete
				</app-dropdown-item>
			</app-dropdown>
		`
	}
}

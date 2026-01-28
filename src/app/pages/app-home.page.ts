import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/select/app-select.element'
import '@app/elements/select-option/app-select-option.element'

@customElement('app-home-page')
export class AppHomePage extends LitElement {
	static styles = [
		css`
			img {
				display: block;
				width: 100%;
				height: 100%;
			}

			h3 {
				margin: 0 0 10px 0;
			}
		`,
	]

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Home')
	}

	protected firstUpdated() {}

	render() {
		return html` <h3>Home</h3>
			<app-select combobox>
				<app-select-option value="option-1">Option 1</app-select-option>
				<app-select-option value="option-2">Option 2</app-select-option>
				<app-select-option value="option-3">Option 3</app-select-option>
				<app-select-option value="option-4">Option 4</app-select-option>
				<app-select-option value="option-5">Option 5</app-select-option>
			</app-select>`
	}
}

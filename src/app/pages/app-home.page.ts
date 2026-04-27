import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/rich-text-editor/app-rich-text-editor.element'

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

			<app-rich-text-editor placeholder="aaaaa" value="test"></app-rich-text-editor>`
	}
}

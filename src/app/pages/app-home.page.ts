import { setDocumentTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

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
		setDocumentTitle('Home')
	}

	protected firstUpdated() {}

	render() {
		return html`Home`
	}
}

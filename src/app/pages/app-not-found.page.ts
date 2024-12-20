import { setDocumentTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-not-found-page')
export class AppNotFoundPage extends LitElement {
	static styles = [css``]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('404')
	}

	render() {
		return html`<h1>Page not found</h1>`
	}
}

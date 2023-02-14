import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-not-found')
export class AppNotFound extends LitElement {
	static styles = [
		css``
	]

	render() {
		return html`<h1>Page not found</h1>`
	}
}

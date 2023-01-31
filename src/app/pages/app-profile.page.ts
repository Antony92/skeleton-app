import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-profile')
export class AppProfile extends LitElement {
	static styles = [
		css``
	]

	render() {
		return html`Profile`
	}
}

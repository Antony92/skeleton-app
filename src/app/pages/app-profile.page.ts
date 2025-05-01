import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-profile-page')
export class AppProfilePage extends LitElement {
	static styles = [css``]

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Profile')
	}

	render() {
		return html`Profile`
	}
}

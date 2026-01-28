import { getUser } from '@app/shared/auth'
import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-profile-page')
export class AppProfilePage extends LitElement {
	static styles = [
		css`
			h3 {
				margin: 0 0 10px 0;
			}
		`,
	]

	private get user() {
		return getUser()
	}

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Profile')
	}

	render() {
		return html`
			<h3>Profile</h3>
			${this.user?.name} - ${this.user?.roles.join(', ')}
		`
	}
}

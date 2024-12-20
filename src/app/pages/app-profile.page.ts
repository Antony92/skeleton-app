import { setDocumentTitle } from '@app/utils/html'
import { PreventCommands, Router, RouterLocation, WebComponentInterface } from '@vaadin/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-profile-page')
export class AppProfilePage extends LitElement implements WebComponentInterface {
	static styles = [css``]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Profile')
	}

	onBeforeLeave(location: RouterLocation, commands: PreventCommands, router: Router) {
		alert(`about to leave ${location.pathname}`)
		return commands.prevent()
	}

	render() {
		return html`Profile`
	}
}

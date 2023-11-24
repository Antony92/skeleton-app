import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/card/card.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { appCardsStyle } from '../../styles/app-cards.style'

import { appPageTitleStyle } from '../../styles/main.style'
import { setDocumentTitle } from '../../utils/html'

@customElement('app-admin')
export class AppAdmin extends LitElement {
	static styles = [
		appCardsStyle,
		appPageTitleStyle,
		css``
	]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Admin')
	}

	render() {
		return html`
			<h3 class="title">Admin</h3>
			<div class="container">
				<sl-card>
					<img
						slot="image"
						src="assets/images/users.jpeg"
						alt="Image representing users"
					/>
					<strong>Users</strong><br /><br />
					View and manage users.
					<div slot="footer">
						<sl-button variant="primary" @click=${() => Router.go('/admin/users')}>Users</sl-button>
					</div>
				</sl-card>
				<sl-card>
					<img
						slot="image"
						src="assets/images/audit.jpeg"
						alt="Image representing audit"
					/>
					<strong>Audit Logs</strong><br /><br />
					View every action done by users.
					<div slot="footer">
						<sl-button variant="primary" @click=${() => Router.go('/admin/audit-logs')}>Audit Logs</sl-button>
					</div>
				</sl-card>
				<sl-card>
					<img
						slot="image"
						src="assets/images/events.jpeg"
						alt="Image representing events"
					/>
					<strong>Server Events</strong><br /><br />
					Manage global system events.
					<div slot="footer">
						<sl-button variant="primary" @click=${() => Router.go('/admin/server-events')}>Server Events</sl-button>
					</div>
				</sl-card>
			</div>
		`
	}
}

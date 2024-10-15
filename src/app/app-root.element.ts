import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './elements/header/app-header.element'
import './elements/sidebar/app-sidebar.element'
import { mainStyle } from './styles/main.style'
import { notify } from './shared/notification'
import { showGlobalMessage } from './shared/global-message'
import { initializeRouter } from './shared/router'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = [mainStyle, css``]

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('offline', () => notify({ variant: 'danger', message: 'You are offline', duration: 5000 }))
		window.addEventListener('online', () => notify({ variant: 'success', message: 'You are back online', duration: 3000 }))

		const serverEventSource = new EventSource(`${import.meta.env.VITE_API}/sse`)
		serverEventSource.addEventListener('globalmessage', (event) => {
			const data = JSON.parse(event.data)
			showGlobalMessage(data.message, data.type)
		})
		serverEventSource.addEventListener('error', (event) => {
			serverEventSource.close()
			notify({ variant: 'danger', message: 'Could not establish connection to server', duration: 5000 })
		})
	}

	async firstUpdated() {
		initializeRouter(this.renderRoot.querySelector('main')!)
	}

	render() {
		return html`
			<div class="layout">
				<app-header class="header"></app-header>
				<app-sidebar class="sidebar"></app-sidebar>
				<main class="main"></main>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-root': AppRoot
	}
}

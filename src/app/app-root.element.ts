import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@app/elements/header/app-header.element'
import '@app/elements/sidebar/app-sidebar.element'
import { mainStyle } from '@app/styles/main.style'
import { notify } from '@app/shared/notification'
import { globalMessage } from '@app/shared/global-message'
import { initializeRouter } from '@app/shared/router'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = [mainStyle, css``]

	@query('#outlet')
	outlet!: HTMLElement

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('offline', () => notify({ variant: 'error', message: 'You are offline', duration: 5000 }))
		window.addEventListener('online', () => notify({ variant: 'success', message: 'You are back online', duration: 3000 }))

		const serverEventSource = new EventSource(`${import.meta.env.VITE_API}/sse`)
		serverEventSource.addEventListener('globalmessage', (event) => {
			const data = JSON.parse(event.data)
			globalMessage(data.message, data.type)
		})
		serverEventSource.addEventListener('error', () => {
			serverEventSource.close()
			// notify({ variant: 'error', message: 'Could not establish connection to server', duration: 5000 })
		})
	}

	protected async firstUpdated() {
		await initializeRouter(this.outlet)
	}

	render() {
		return html`
			<div class="layout">
				<app-header class="header"></app-header>
				<app-sidebar class="sidebar"></app-sidebar>
				<main id="outlet" class="main"></main>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-root': AppRoot
	}
}

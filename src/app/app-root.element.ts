import { Router } from '@vaadin/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './elements/global-message/app-global-message.element'
import './elements/header/app-header.element'
import './elements/sidebar/app-sidebar.element'
import { mainStyle } from './styles/main.style'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = [mainStyle, css``]

	static router = new Router()
	
	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('offline', () => console.log('offline'))
		window.addEventListener('online', () => console.log('online'))
	}

	firstUpdated() {
		AppRoot.router.setOutlet(this.renderRoot.querySelector('main'))
		AppRoot.router.setRoutes([
			{ 
				path: '/', 
				component: 'app-home',
				action: async (context, command) => {
					await import('./pages/app-home.page')
				}
			},
			{ 
				path: '/form', 
				component: 'app-demo-form',
				action: async (context, command) => {
					await import('./pages/app-demo-form.page')
				}
			},
			{ 
				path: '/alerts', 
				component: 'app-demo-alerts',
				action: async (context, command) => {
					await import('./pages/app-demo-alerts.page')
				}
			},
			{ 
				path: '/table', 
				component: 'app-demo-table',
				action: async (context, command) => {
					await import('./pages/app-demo-table.page')
				}
			},
			{ 
				path: '/profile', 
				component: 'app-profile',
				action: async (context, command) => {
					await import('./pages/app-profile.page')
				}
			},
			{	
				path: '(.*)', 
				component: 'app-not-found',
				action: async (context, command) => {
					await import('./pages/app-not-found.page')
				}
			},
		])
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

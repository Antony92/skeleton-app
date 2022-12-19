import { Router } from '@lit-labs/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './elements/app-global-message.element'
import './elements/app-header.element'
import './elements/app-sidebar.element'
import { hideGlobalMessage, showGlobalMessage } from './services/global-message.service'
import { mainStyle } from './styles/main.style'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = [
		mainStyle,
		css``
	]

	private router = new Router(this, [
		{ path: '/', render: () => html`<img height="100%" width="100%" style="display: block;" alt="Home image of an astronaut" src="assets/images/astro.svg"/>` },
		{
			path: '/form',
			render: () => html`<app-demo-form></app-demo-form>`,
			enter: async () => {
				await import('./pages/app-demo-form.page')
				return true
			},
		},
		{
			path: '/alerts',
			render: () => html`<app-demo-alerts></app-demo-alerts>`,
			enter: async () => {
				await import('./pages/app-demo-alerts.page')
				return true
			},
		},
		{
			path: '/table',
			render: () => html`<app-demo-table></app-demo-table>`,
			enter: async () => {
				await import('./pages/app-demo-table.page')
				return true
			},
		},
		{
			path: '/profile',
			render: () => html`<app-demo-table></app-demo-table>`,
			enter: async () => {
				await import('./pages/app-demo-table.page')
				return true
			},
		},
		{ path: '/*', render: () => html`<img height="100%" width="100%" alt="404 Not found" src="assets/images/page-not-found.svg"/>` },
	])

	override connectedCallback() {
		super.connectedCallback()
		window.addEventListener('offline', () => showGlobalMessage('No internet connection', 'danger'))
		window.addEventListener('online', () => hideGlobalMessage())
	}

	override render() {
		return html`
			<div class="container">
				<app-header appTitle="Application" class="header"></app-header>
				<app-sidebar class="sidebar"></app-sidebar>
				<main class="main">${this.router.outlet()}</main>
			</div>
		`
	}
}

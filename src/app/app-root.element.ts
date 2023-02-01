import { Router } from '@lit-labs/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './elements/global-message/app-global-message.element'
import './elements/header/app-header.element'
import './elements/sidebar/app-sidebar.element'
import { navigationEvent } from './navigation/navigation'
import { mainStyle } from './styles/main.style'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = [mainStyle, css``]

	router = new Router(this, [
		{
			path: '/',
			render: () =>
				html`<img height="100%" width="100%" style="display: block;" alt="Home image of an astronaut" src="assets/images/astro.svg" />`,
			enter: async () => {
				navigationEvent('/')
				return true
			}
		},
		{
			path: '/form',
			render: () => html`<app-demo-form></app-demo-form>`,
			enter: async () => {
				navigationEvent('/form')
				await import('./pages/app-demo-form.page')
				return true
			},
		},
		{
			path: '/alerts',
			render: () => html`<app-demo-alerts></app-demo-alerts>`,
			enter: async () => {
				navigationEvent('/alerts')
				await import('./pages/app-demo-alerts.page')
				return true
			},
		},
		{
			path: '/table',
			render: () => html`<app-demo-table></app-demo-table>`,
			enter: async () => {
				navigationEvent('/table')
				await import('./pages/app-demo-table.page')
				return true
			},
		},
		{
			path: '/profile',
			render: () => html`<app-profile></app-profile>`,
			enter: async () => {
				navigationEvent('/profile')
				await import('./pages/app-profile.page')
				return true
			},
		},
		{ path: '/*', render: () => html`<h1>Page not found</h1>` },
	])

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('offline', () => console.log('offline'))
		window.addEventListener('online', () => console.log('online'))
	}

	render() {
		return html`
			<div class="layout">
				<app-header class="header"></app-header>
				<app-sidebar class="sidebar"></app-sidebar>
				<main class="main">${this.router.outlet()}</main>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-root': AppRoot
	}
}

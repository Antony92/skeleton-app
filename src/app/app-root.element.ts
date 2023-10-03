import { Router } from '@vaadin/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './elements/header/app-header.element'
import './elements/sidebar/app-sidebar.element'
import { getUser } from './services/auth.service'
import { mainStyle } from './styles/main.style'
import { notify } from './shared/notification'
import { showGlobalMessage } from './shared/global-message'
import { Role } from './types/user.type'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = [mainStyle, css``]

	router = new Router()

	async connectedCallback() {
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

	async AuthGuard(page: string, roles?: string[]) {
		const user = await getUser()
		if (!user) {
			localStorage.setItem('requested-page', page || '/')
			Router.go('/login')
			return false
		}
		if (user && roles && !user.roles?.some((role: string) => roles.includes(role))) {
			Router.go('/page-not-found')
			return false
		}
		return true
	}

	async firstUpdated() {
		this.router.setOutlet(this.renderRoot.querySelector('main'))
		this.router.setRoutes([
			{
				path: '/',
				redirect: '/home'
			},
			{
				path: '/home',
				component: 'app-home',
				action: async (context, command) => {
					await import('./pages/app-home.page')
				},
			},
			{
				path: '/feedback',
				component: 'app-feedback',
				action: async (context, command) => {
					if (!(await this.AuthGuard(context.pathname + context.search))) {
						return
					}
					await import('./pages/app-feedback.page')
				},
			},
			{
				path: '/admin',
				children: [
					{
						path: '/',
						component: 'app-admin',
						action: async (context, command) => {
							if (!(await this.AuthGuard(context.pathname + context.search, [Role.ADMIN]))) {
								return
							}
							await import('./pages/admin/app-admin.page')
						},
					},
					{
						path: '/server-events',
						component: 'app-ad-server-events',
						action: async (context, command) => {
							if (!(await this.AuthGuard(context.pathname + context.search, [Role.ADMIN]))) {
								return
							}
							await import('./pages/admin/app-ad-server-events.page')
						},
					},
					{
						path: '/users',
						component: 'app-ad-users',
						action: async (context, command) => {
							if (!(await this.AuthGuard(context.pathname + context.search, [Role.ADMIN]))) {
								return
							}
							await import('./pages/admin/app-ad-users.page')
						},
					},
					{
						path: '/audit-logs',
						component: 'app-ad-audit-logs',
						action: async (context, command) => {
							if (!(await this.AuthGuard(context.pathname + context.search, [Role.ADMIN]))) {
								return
							}
							await import('./pages/admin/app-ad-audit-logs.page')
						},
					},
				],
			},
			{
				path: '/login',
				component: 'app-login',
				action: async (context, command) => {
					await import('./pages/app-login.page')
				},
			},
			{
				path: '/profile',
				component: 'app-profile',
				action: async (context, command) => {
					if (!(await this.AuthGuard(context.pathname + context.search))) {
						return
					}
					await import('./pages/app-profile.page')
				},
			},
			{
				path: '(.*)',
				component: 'app-not-found',
				action: async (context, command) => {
					await import('./pages/app-not-found.page')
				},
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

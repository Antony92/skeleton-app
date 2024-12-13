import '@app/elements/theme-switcher/app-theme-switcher.element'
import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { login, logout } from '@app/shared/auth'
import { getUserObservable } from '@app/shared/auth'
import { appHeaderStyle } from '@app/elements/header/app-header.style'
import { Subscription } from 'rxjs'
import { Router, RouterLocation } from '@vaadin/router'
import { when } from 'lit/directives/when.js'
import { User } from '@app/types/user.type'
import '@app/elements/button/app-button.element'

@customElement('app-header')
export class AppHeader extends LitElement {
	static styles = [appHeaderStyle, css``]

	private appTitle = import.meta.env.VITE_APP_TITLE || 'Skeleton App'
	private appVersion = import.meta.env.VITE_APP_VERSION || '-1'

	@state()
	private user: User = null

	@state()
	private initials = ''

	userSubscription = new Subscription()

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('vaadin-router-location-changed', this.setActiveLink)
		this.userSubscription = getUserObservable().subscribe((user) => {
			this.user = user
			this.initials =
				this.user?.name
					.match(/\b(\w)/g)
					?.join('')
					.toUpperCase() || ''
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('vaadin-router-location-changed', this.setActiveLink)
		this.userSubscription.unsubscribe()
	}

	setActiveLink = (event: CustomEvent<{ router: Router; location: RouterLocation }>) => {
		const {
			location: { pathname },
		} = event.detail
		this.renderRoot.querySelector('a.active')?.classList.remove('active')
		this.renderRoot.querySelector(`a[href="/${pathname.split('/')[1]}"]`)?.classList.add('active')
	}

	async signIn() {
		localStorage.removeItem('requested-page')
		login()
	}

	async signOut() {
		Router.go('/')
		await logout()
	}

	render() {
		return html`
			<header>
				<img class="logo" src="assets/logo.png" />
				<h2 class="title">${this.appTitle}</h2>
				${when(this.user?.impersonated, () => html`Impersonate mode`)}
				<div class="spacer"></div>
				<app-theme-switcher></app-theme-switcher>
				${when(
					this.user,
					() => html`<div class="avatar" @click=${() => this.signOut()}>${this.initials}</div>`,
					() => html`<app-button variant="primary" @click=${() => this.signIn()}>Sign in</app-button>`
				)}
			</header>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-header': AppHeader
	}
}

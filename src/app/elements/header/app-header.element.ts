import { html, LitElement, css } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { customElement, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import '../theme-switcher/app-theme-switcher.element'
import { login, logout } from '../../services/auth.service'
import { whenUser } from '../../directives/when-user.directive'
import { getUserObservable } from '../../services/auth.service'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { appDrawerStyle, appHeaderStyle } from '../../styles/app-header.style'
import { Subscription } from 'rxjs'
import { Router, RouterLocation } from '@vaadin/router'
import { whenUserRole } from '../../directives/when-user-role.directive'
import { classMap } from 'lit/directives/class-map.js'
import { Role } from '../../types/user.type'
import { when } from 'lit/directives/when.js'

@customElement('app-header')
export class AppHeader extends LitElement {
	static styles = [appHeaderStyle, appDrawerStyle, css``]

	#appTitle = import.meta.env.VITE_APP_TITLE || 'Application'
	#appVersion = import.meta.env.VITE_APP_VERSION || '-1'

	@state()
	fullname = ''

	@state()
	initials: string | undefined = ''

	@state()
	impersonating = false

	@query('sl-drawer') drawer!: SlDrawer

	userSubscription = new Subscription()

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('vaadin-router-location-changed', this.setActiveLink)
		this.userSubscription = getUserObservable().subscribe((user) => {
			if (user) {
				this.fullname = user.name
				this.impersonating = user.impersonated ? true : false
				this.initials = this.fullname
					.match(/\b(\w)/g)
					?.join('')
					.toUpperCase()
			}
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
				<sl-icon-button class="hamburger" title="Menu" name="list" label="Menu" @click=${() => this.drawer.show()}></sl-icon-button>
				<img class="logo" src="assets/logo.png"/>
				<h2 class="title">${this.#appTitle}</h2>
				${when(this.impersonating, () => html`<sl-badge pulse variant="warning">Impersonate mode</sl-badge>`)}
				<div class="spacer"></div>
				<sl-dropdown>
					<sl-icon-button title="Help" slot="trigger" name="question-circle-fill" label="Help"></sl-icon-button>
					<sl-menu>
						<sl-menu-label>Version ${this.#appVersion}</sl-menu-label>
						<sl-menu-item @click=${() => window.open(`${import.meta.env.VITE_APP_WHATS_NEW_LINK}`, '_blank')}>What's new</sl-menu-item>
						<sl-menu-item @click=${() => window.open(`${import.meta.env.VITE_APP_HELP_LINK}`, '_blank')}>Help</sl-menu-item>
						<sl-menu-item @click=${() => window.open(`/documentation`, '_blank')}>API Docs</sl-menu-item>
						<sl-divider></sl-divider>
						<sl-menu-item @click=${() => Router.go('/feedback')}>Feedback</sl-menu-item>
						<sl-menu-item @click=${() => window.open(`${import.meta.env.VITE_APP_BUG_REPORT_LINK}`, '_blank')}>Report bug</sl-menu-item>
					</sl-menu>
				</sl-dropdown>
				<app-theme-switcher></app-theme-switcher>
				${whenUser(
					() => html`
						<sl-dropdown>
							<sl-avatar slot="trigger" initials=${ifDefined(this.initials)} label="User avatar"></sl-avatar>
							<sl-menu>
								<sl-menu-label>${this.fullname}</sl-menu-label>
								<sl-menu-item @click=${() => Router.go('/profile')}>
									<sl-icon slot="prefix" name="person-fill"></sl-icon>
									Profile
								</sl-menu-item>
								<sl-divider></sl-divider>
								<sl-menu-item @click=${() => this.signOut()}>
									<sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
									Logout
								</sl-menu-item>
							</sl-menu>
						</sl-dropdown>
					`,
					() => html`<sl-button variant="primary" pill @click=${() => this.signIn()}>Sign in</sl-button>`
				)}
			</header>

			<sl-drawer label="App" placement="start">
				<ul>
					<li>
						<a href="/home" @click=${() => this.drawer.hide()}>
							<sl-icon name="house-fill"></sl-icon>
							Home
						</a>
					</li>
					${whenUserRole(
						[Role.ADMIN],
						() => html`
							<li>
								<a
									href="/admin"
									@click=${() => this.drawer.hide()}
									class=${classMap({ active: location.pathname.includes('/admin') })}
								>
									<sl-icon name="person-fill-lock"></sl-icon>
									Admin
								</a>
							</li>
						`
					)}
				</ul>
			</sl-drawer>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-header': AppHeader
	}
}

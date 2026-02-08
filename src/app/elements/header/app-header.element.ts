import '@app/elements/button/app-button.element'
import '@app/elements/dropdown/app-dropdown.element'
import '@app/elements/dropdown-item/app-dropdown-item.element'
import '@app/elements/theme-switcher/app-theme-switcher.element'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { appHeaderStyle } from '@app/elements/header/app-header.style'
import { when } from 'lit/directives/when.js'
import { navigate } from '@app/shared/navigation'
import { defaultStyle } from '@app/styles/default.style'
import { computed, SignalWatcher } from '@lit-labs/signals'
import { getUser, login, logout } from '@app/shared/auth'

@customElement('app-header')
export class AppHeader extends SignalWatcher(LitElement) {
	static styles = [defaultStyle, appHeaderStyle, css``]

  private appTitle = import.meta.env.VITE_APP_TITLE || 'Skeleton App'
	private appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0-alpha'

	private get user() {
		return getUser()
	}

	private get initials() {
		return this.$initials.get()
	}

	private $initials = computed(() => {
		return this.user?.name
			.match(/\b(\w)/g)
			?.join('')
			.toUpperCase()
	})

	async signIn() {
		localStorage.removeItem('requested-page')
		login()
	}

	async signOut() {
		navigate('/')
		await logout()
	}

	render() {
		return html`
			<header>
				<img class="logo" src="/images/logo.png" />
				<h2 class="title" title=${this.appVersion}>${this.appTitle}</h2>
				${when(this.user?.impersonated, () => html`Impersonate mode`)}
				<div class="spacer"></div>
				<app-theme-switcher></app-theme-switcher>
				${when(
					this.user,
					() => html`
						<app-dropdown>
							<button slot="trigger" class="avatar">${this.initials}</button>
							<app-dropdown-item @click=${() => navigate('/profile')}>
								<app-icon slot="prefix">account_box</app-icon>
								Profile
							</app-dropdown-item>
							<app-dropdown-item @click=${() => this.signOut()}>
								<app-icon slot="prefix">logout</app-icon>
								Logout
							</app-dropdown-item>
						</app-dropdown>
					`,
					() => html`<app-button variant="primary" @click=${() => this.signIn()}>Sign in</app-button>`,
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

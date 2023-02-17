import { html, LitElement, css } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { customElement, property, query, state } from 'lit/decorators.js'
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
import { login, logout } from '../../services/login.service'
import { whenUser } from '../../directives/when-user.directive'
import { getUser, removeUser, setUser } from '../../services/user.service'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { appDrawerStyle, appHeaderStyle } from '../../styles/app-header.style'
import { Subscription } from 'rxjs'
import { Router, RouterLocation } from '@vaadin/router'

@customElement('app-header')
export class AppHeader extends LitElement {
	static styles = [
        appHeaderStyle,
        appDrawerStyle,
        css``
    ]

	#appTitle = import.meta.env.VITE_APP_TITLE || 'Application'
    #appVersion = import.meta.env.VITE_APP_VERSION || '-1'

    @state()
    fullname = ''

    @state()
    initials: string | undefined  = ''

    @state()
    loginLoading = false

    @query('sl-drawer') drawer!: SlDrawer

    userSubscription = new Subscription()

    connectedCallback() {
        super.connectedCallback()
        window.addEventListener('vaadin-router-location-changed', this.setActiveLink)
        this.userSubscription = getUser().subscribe((user: any) => {
            if (user) {
                this.fullname = `${user.firstName} ${user.lastName}`
                this.initials = this.fullname.match(/\b(\w)/g)?.join('').toUpperCase()
            }
        })
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener('vaadin-router-location-changed', this.setActiveLink)
        this.userSubscription.unsubscribe()
    }

    setActiveLink = (event: CustomEvent<{ router: Router, location: RouterLocation }>) => {
		const { location: { pathname } } = event.detail
		this.renderRoot.querySelector('a.active')?.classList.remove('active')
		this.renderRoot.querySelector(`a[href="${pathname}"]`)?.classList.add('active')
	}

    async signIn() {
        this.loginLoading = true
        const user = await login()
        setUser(user)
        this.loginLoading = false
    }

    async signOut() {
        removeUser()
        Router.go('/')
        await logout()
    }

	render() {
		return html`
			<header>
                <sl-icon-button class="hamburger" title="Menu" name="list" label="Menu" @click=${() => this.drawer.show()}></sl-icon-button>
                <h1 class="title">${this.#appTitle}</h1>
                <div class="spacer"></div>
                <sl-dropdown>
                    <sl-icon-button title="Help" slot="trigger" name="question-circle-fill" label="Help"></sl-icon-button>
                    <sl-menu>
                        <sl-menu-label>Version ${this.#appVersion}</sl-menu-label>
                        <sl-menu-item>What's new</sl-menu-item>
                        <sl-menu-item>Help</sl-menu-item>
                        <sl-divider></sl-divider>
                        <sl-menu-item>Feedback</sl-menu-item>
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
                                <sl-menu-item>
                                    <sl-icon slot="prefix" name="bell-fill"></sl-icon>
                                    Notifications 
                                    <sl-badge slot="suffix" variant="primary" pulse pill>4</sl-badge>
                                </sl-menu-item>
                                <sl-divider></sl-divider>
                                <sl-menu-item @click=${() => this.signOut()}>
                                    <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
                                    Logout
                                </sl-menu-item>
                            </sl-menu>
                        </sl-dropdown>
                    `, 
                    () => html`<sl-button variant="primary" pill @click=${() => this.signIn()} ?loading=${this.loginLoading}>Sign in</sl-button>`
                )}
                
            </header>

            <sl-drawer label="Navigation" placement="start">
                    <ul>
                        <li>
                            <a href="/" @click=${() => this.drawer.hide()}>
                                <sl-icon name="house-door-fill"></sl-icon>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/form" @click=${() => this.drawer.hide()}>
                                <sl-icon name="postcard-fill"></sl-icon>
                                Form
                            </a>
                        </li>
                        <li>
                            <a href="/alerts" @click=${() => this.drawer.hide()}>
                                <sl-icon name="exclamation-square-fill"></sl-icon>
                                Alerts
                            </a>
                        </li>
                        <li>
                            <a href="/table" @click=${() => this.drawer.hide()}>
                                <sl-icon name="table"></sl-icon>
                                Table
                            </a>
                        </li>
                        ${whenUser(() => html`
                            <li>
                                <a href="/admin" @click=${() => this.drawer.hide()}>
                                    <sl-icon name="person-fill-gear"></sl-icon>
                                    Admin
                                </a>
                            </li>
                        `)}
                       
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

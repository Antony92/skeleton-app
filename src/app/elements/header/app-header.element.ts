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
import { getUser } from '../../services/user.service'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { appDrawerStyle, appHeaderStyle } from '../../styles/app-header.style'
import { navigate } from '../../navigation/navigation'

@customElement('app-header')
export class AppHeader extends LitElement {
	static styles = [
        appHeaderStyle,
        appDrawerStyle,
        css``
    ]
    @property({ type: String, reflect: true })
	appTitle = import.meta.env.VITE_APP_TITLE || 'Application'

    @state()
    fullname: string = ''

    @state()
    initials: string | undefined  = ''

    @state()
    loginLoading = false

    @query('sl-drawer') drawer!: SlDrawer

    connectedCallback() {
        super.connectedCallback()
        getUser().subscribe(user => {
            if (user) {
                this.fullname = `${user.firstName} ${user.lastName}`
                this.initials = this.fullname.match(/\b(\w)/g)?.join('').toUpperCase()
            }
        })
    }

    firstUpdated() {
		const path = location.pathname.split('/')[1]
		this.drawer?.querySelector(`a[href="/${path}"]`)?.classList.add('active')
	}

    async signIn() {
        this.loginLoading = true
        await login()
        this.loginLoading = false
    }

    #handleLinkClick(event: Event) {
		const activeLink = this.drawer?.querySelector('a.active')
		activeLink?.classList.remove('active')
		const clickedLink = <HTMLAnchorElement>event.currentTarget
		clickedLink?.classList.add('active')
        this.drawer.hide()
	}

	render() {
		return html`
			<header>
                <sl-icon-button class="menu-button" title="Menu" name="list" label="Menu" @click=${() => this.drawer.show()}></sl-icon-button>
                <h1 class="title">${this.appTitle}</h1>
                <div class="spacer"></div>
                <sl-dropdown>
                    <sl-icon-button title="Help" slot="trigger" name="question-circle-fill" label="Help"></sl-icon-button>
                    <sl-menu>
                        <sl-menu-label>Version 1.10</sl-menu-label>
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
                                <sl-menu-item @click=${() => navigate('/profile')}>
                                    <sl-icon slot="prefix" name="person-fill"></sl-icon>
                                    Profile
                                </sl-menu-item>
                                <sl-menu-item>
                                    <sl-icon slot="prefix" name="bell-fill"></sl-icon>
                                    Notifications 
                                    <sl-badge slot="suffix" variant="primary" pulse pill>4</sl-badge>
                                </sl-menu-item>
                                <sl-divider></sl-divider>
                                <sl-menu-item @click=${() => logout()}>
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
                            <a href="/" @click=${this.#handleLinkClick}>
                                <sl-icon name="house-door-fill"></sl-icon>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/form" @click=${this.#handleLinkClick}>
                                <sl-icon name="postcard-fill"></sl-icon>
                                Form
                            </a>
                        </li>
                        <li>
                            <a href="/alerts" @click=${this.#handleLinkClick}>
                                <sl-icon name="exclamation-square-fill"></sl-icon>
                                Alerts
                            </a>
                        </li>
                        <li>
                            <a href="/table" @click=${this.#handleLinkClick}>
                                <sl-icon name="table"></sl-icon>
                                Table
                            </a>
                        </li>
                        ${whenUser(() => html`
                            <li>
                                <a href="/admin" @click=${this.#handleLinkClick}>
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

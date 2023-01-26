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

@customElement('app-header')
export class AppHeader extends LitElement {
	static styles = css`
        header {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            height: 60px;
            padding: 0 5px;
            box-shadow: var(--sl-shadow-x-large);
        }

        .spacer {
            flex-grow: 1;
        }

        .title {
            font-size: var(--sl-font-size-large)
        }

        .menu-button {
            font-size: 30px;
        }

        sl-drawer {
            --size: 320px;
        }

        sl-avatar {
            cursor: pointer;
        }
    `
    @property({ type: String, reflect: true })
	appTitle = ''

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

    async signIn() {
        this.loginLoading = true
        await login()
        this.loginLoading = false
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
                                <sl-menu-item>
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
                            <a>
                                <sl-icon name="browser-chrome"></sl-icon>
                                Link
                            </a>
                        </li>
                        <li>
                            <a>
                                <sl-icon name="browser-chrome"></sl-icon>
                                Link
                            </a>
                        </li>
                        <li>
                            <a>
                                <sl-icon name="browser-chrome"></sl-icon>
                                Link
                            </a>
                        </li>
                        <li>
                            <a>
                                <sl-icon name="browser-chrome"></sl-icon>
                                Link
                            </a>
                        </li>
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

import { html, LitElement, css } from 'lit'
import { when } from 'lit/directives/when.js'
import {ifDefined} from 'lit/directives/if-defined.js';
import { customElement, property, state } from 'lit/decorators.js'
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
import './app-theme-switcher.element'
import { authState, login, logout } from '../services/auth.service'

@customElement('app-header')
export class AppSidebar extends LitElement {
	static styles = css`
        header {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            padding: 8px 16px;
            box-shadow: var(--sl-shadow-x-large);
        }

        .spacer {
            flex-grow: 1;
        }

        .title {
            font-size: var(--sl-font-size-large)
        }

        sl-avatar {
            cursor: pointer;
        }
    `
    @property({ type: String, reflect: true })
	appTitle = ''

    @state()
    authenticated = false

    @state()
    fullname: string | undefined = ''

    @state()
    initials: string | undefined = ''

    override firstUpdated() {
        authState.subscribe(state => {
            this.authenticated = state
            if (state) {
                const user = JSON.parse(localStorage.getItem('user')!)
                this.fullname = `${user?.firstName} ${user?.lastName}`
                this.initials = this.fullname?.match(/\b(\w)/g)?.join('').toUpperCase()
            }
        })
    }

	override render() {
		return html`
			<header>
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
                <app-theme-switcher title="Theme"></app-theme-switcher>
                ${when(this.authenticated, 
                    () => html`
                        <sl-dropdown>
                            <sl-avatar slot="trigger" initials="${ifDefined(this.initials)}" label="User avatar"></sl-avatar>
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
                                <sl-menu-item @click="${() => logout()}">
                                    <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
                                    Logout
                                </sl-menu-item>
                            </sl-menu>
                        </sl-dropdown>
                    `, 
                    () => html`<sl-button variant="primary" pill @click="${() => login()}">Sign in</sl-button>`
                )}
                
            </header>
		`
	}
}

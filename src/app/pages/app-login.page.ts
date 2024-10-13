import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import { getURLSearchParamsAsObject } from '../utils/url'
import { login, setAccessToken, setUser } from '../shared/auth'
import { when } from 'lit/directives/when.js'
import { Router } from '@vaadin/router'
import { setDocumentTitle } from '../utils/html'

@customElement('app-login')
export class AppLogin extends LitElement {
	static styles = [
		css`
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                height: 100%;
            }

            sl-spinner {
                font-size: 3rem;
            }
        `
	]

    error: string | null = null

    connectedCallback() {
        super.connectedCallback()
        setDocumentTitle('Login')
        const { token, error } = getURLSearchParamsAsObject()
        if (error) {
            this.error = error
            return
        }
        if (!token) {
            login()
            return
        }
        try {
            const { user } = JSON.parse(window.atob(token.split('.')[1]))
            setUser(user)
            setAccessToken(token)
            Router.go(localStorage.getItem('requested-page') || '/')
            localStorage.removeItem('requested-page')
        } catch (error) {
            console.error(error)
            this.error = 'Invald token'
        }
    }

	render() {
		return html`
            <div class="container">
                ${when(this.error, 
                    () => html`<span>${this.error}</span>`, 
                    () => html`
                        <div>
                            <sl-spinner></sl-spinner>
                        </div>
                        <span>Authenticating...</span>
                    `
                )}
            </div> 
        `
	}
}

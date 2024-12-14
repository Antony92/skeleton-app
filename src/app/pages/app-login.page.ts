import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { getURLSearchParamsAsObject } from '@app/utils/url'
import { login, setAccessToken, setUser } from '@app/shared/auth'
import { when } from 'lit/directives/when.js'
import { Router } from '@vaadin/router'
import { setDocumentTitle } from '@app/utils/html'
import 'ldrs/ring2'
import { Role } from '@app/types/user.type'
import { dummyLogin } from '@app/services/api.service'

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
		`,
	]

	@state()
	private error = ''

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Login')
		const { token, error } = getURLSearchParamsAsObject()
		if (error) {
			this.error = error
			return
		}
		if (!token) {
			dummyLogin({ username: 'emilys', password: 'emilyspass' })
			// login()
			return
		}
		try {
			const user = JSON.parse(window.atob(token.split('.')[1]))
			setUser({
				id: user.id,
				username: user.email,
				name: `${user.firstName} ${user.lastName}`,
				roles: [Role.ADMIN],
			})
			// const { user } = JSON.parse(window.atob(token.split('.')[1]))
			// setUser(user)
			setAccessToken(token)
			Router.go(localStorage.getItem('requested-page') || '/')
			localStorage.removeItem('requested-page')
		} catch (error) {
			console.error(error)
			this.error = 'Invalid token'
		}
	}

	render() {
		return html`
			<div class="container">
				${when(
					this.error,
					() => html`<p>${this.error}</p>`,
					() => html`
						<l-ring-2 color="var(--theme-primary-color)"></l-ring-2>
						<p>Authenticating...</p>
					`
				)}
			</div>
		`
	}
}

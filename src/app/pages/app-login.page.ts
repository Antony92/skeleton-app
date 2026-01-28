import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { getURLSearchParamsAsObject } from '@app/utils/url'
import { when } from 'lit/directives/when.js'
import { setPageTitle } from '@app/utils/html'
import { Role } from '@app/types/user.type'
import { dummyLogin } from '@app/services/api.service'
import { navigate } from '@app/shared/navigation'
import { setUser } from '@app/shared/auth'

@customElement('app-login-page')
export class AppLoginPage extends LitElement {
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
	private accessor error = ''

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Login')
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
			const user = JSON.parse(atob(token.split('.')[1]))
			setUser({
				id: user.id,
				username: user.email,
				name: `${user.firstName} ${user.lastName}`,
        roles: [Role.ADMIN],
        accessToken: token
			})
			navigate(localStorage.getItem('requested-page') || '/')
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
						<p>Authenticating...</p>
					`,
				)}
			</div>
		`
	}
}

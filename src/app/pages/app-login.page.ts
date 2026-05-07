import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { setPageTitle } from '@app/utils/html'
import { dummyLogin } from '@app/services/api.service'
import { getRouteSearch, navigate } from '@app/shared/navigation'
import { getUser } from '@app/shared/auth'

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
	private error = ''

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Login')
    const { error } = getRouteSearch()
		const user = getUser()
		if (!user && error) {
			this.error = error
			return
		}
		if (!user) {
			dummyLogin({ username: 'emilys', password: 'emilyspass' })
			// login()
			return
		}
		try {
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

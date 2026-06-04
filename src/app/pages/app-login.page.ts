import { getUser, login } from '@app/shared/auth';
import { getRouteSearch, navigate } from '@app/shared/navigation';
import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

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
	];

	@state()
	private error = '';

	connectedCallback() {
		super.connectedCallback();
		setPageTitle('Login');
		const { error } = getRouteSearch();
		const user = getUser();
		if (user) {
			navigate(localStorage.getItem('requested-page') || '/');
			localStorage.removeItem('requested-page');
		} else if (error) {
			this.error = error;
		} else {
			login();
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
		`;
	}
}

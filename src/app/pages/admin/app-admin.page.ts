import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-admin-page')
export class AppAdminPage extends LitElement {
	static styles = [
		css`
			h3 {
				margin: 0 0 10px 0;
			}
		`,
	];

	connectedCallback() {
		super.connectedCallback();
		setPageTitle('Admin');
	}

	render() {
		return html` <h3>Admin</h3> `;
	}
}

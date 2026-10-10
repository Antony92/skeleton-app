import { getUser } from '@app/services/api.service';
import { getRouteParams } from '@app/shared/navigation';
import { setPageTitle } from '@app/utils/html';
import { Task } from '@lit/task';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-test-page')
export class AppTestPage extends LitElement {
	static styles = [
		css`
			h3 {
				margin: 0 0 10px 0;
			}
		`,
	];

	@property()
	userId = '';

	connectedCallback() {
		super.connectedCallback();
		setPageTitle(`Test page`);
		const { id } = getRouteParams();
		this.userId = id || '';
	}

	private getUserTask = new Task(this, {
		task: async ([userId]) => getUser(userId),
		args: () => [this.userId],
	});

	render() {
		return this.getUserTask.render({
			pending: () => html`<p>Loading user...</p>`,
			complete: (user) => html`
				<h3>${user.firstName} ${user.lastName}</h3>
				<p>${user.email}</p>
			`,
			error: (e) => html`<p>Error: ${e}</p>`,
		});
	}
}

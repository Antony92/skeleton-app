import { getProduct } from '@app/services/api.service'
import { getRouteParams } from '@app/shared/navigation'
import { setPageTitle } from '@app/utils/html'
import { Task } from '@lit/task'
import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-test-page')
export class AppTestPage extends LitElement {
	static styles = [
		css`
			h3 {
				margin: 0 0 10px 0;
			}
		`,
	]

	@property()
	pageId = ''

	connectedCallback() {
		super.connectedCallback()
		setPageTitle(`Test page`)
		const { id } = getRouteParams()
		this.pageId = id || ''
	}

	private getProductTask = new Task(this, {
		task: async ([pageId]) => getProduct(pageId),
		args: () => [this.pageId],
	})

	render() {
		return this.getProductTask.render({
			pending: () => html`<p>Loading product...</p>`,
			complete: (product) => html`
				<h3>${product.title}</h3>
				<p>${product.price}</p>
			`,
			error: (e) => html`<p>Error: ${e}</p>`,
		})
	}
}

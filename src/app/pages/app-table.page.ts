import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'

@customElement('app-table')
export class AppTable extends LitElement {
	static styles = [css``]

	protected async firstUpdated() {}

	render() {
		return html` Table `
	}
}

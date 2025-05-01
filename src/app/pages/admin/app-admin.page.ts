import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { setPageTitle } from '@app/utils/html'

@customElement('app-admin')
export class AppAdmin extends LitElement {
	static styles = [css``]

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Admin')
	}

	render() {
		return html` Admin `
	}
}

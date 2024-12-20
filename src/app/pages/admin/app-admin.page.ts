import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { setDocumentTitle } from '@app/utils/html'

@customElement('app-admin')
export class AppAdmin extends LitElement {
	static styles = [css``]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Admin')
	}

	render() {
		return html` Admin `
	}
}

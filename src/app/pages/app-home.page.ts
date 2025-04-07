import { setDocumentTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/rich-text-editor/app-rich-text-editor.element'

@customElement('app-home-page')
export class AppHomePage extends LitElement {
	static styles = [
		css`
			img {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Home')
	}

	protected firstUpdated() {}

	render() {
		return html`
			<app-rich-text-editor placeholder="Write something" value="sup"></app-rich-text-editor>
		`
	}
}

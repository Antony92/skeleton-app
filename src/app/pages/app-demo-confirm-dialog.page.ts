import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { confirmDialog } from '../services/confirm-dialog.service'

@customElement('app-demo-confirm-dialog')
export class AppDemoConfirmDialog extends LitElement {
	static styles = css``

	@query('sl-button') button!: HTMLElementTagNameMap['sl-button']

	override firstUpdated() {
		this.button.addEventListener('click', (event) => {
			this.button.disabled = true
			confirmDialog('Confirm', 'Are you sure?').then((result) => {
				this.button.disabled = false
				console.log(result)
			})
		})
	}

	override render() {
		return html`<sl-button variant="primary">Confirm</sl-button>`
	}
}

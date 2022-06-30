import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { confirmDialog } from '../services/confirm-dialog.service'

@customElement('app-demo-confirm-dialog')
export class AppDemoConfirmDialog extends LitElement {
    static styles = css``

	override render() {
		return html`
            <sl-button @click="${() => confirmDialog('Confirm', 'Are you sure?').then(console.log)}" variant="primary">Confirm</sl-button>
		`
	}
    
}
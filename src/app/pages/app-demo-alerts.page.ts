import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { notify } from '../services/notify.service'
import { confirmDialog } from '../services/confirm-dialog.service'

@customElement('app-demo-alerts')
export class AppDemoAlerts extends LitElement {
	static styles = css``

	@query('#confirm-button') 
	confirmButton!: HTMLElementTagNameMap['sl-button']

	override firstUpdated() {
		this.confirmButton.addEventListener('click', (event) => {
			this.confirmButton.disabled = true
			confirmDialog('Confirm', 'Are you sure?').then((result) => {
				this.confirmButton.disabled = false
				console.log(result)
			})
		})
	}

	override render() {
		return html`
			Confirm dialog
			<sl-button id="confirm-button" variant="primary">Confirm</sl-button>
			<br /><br />
			Alerts
			<sl-button @click="${() => notify('Hello', 'primary', 3000, 'info-circle')}" variant="primary">Primary</sl-button>
			<sl-button @click="${() => notify('Hello', 'success', 3000, 'check2-circle')}" variant="success">Success</sl-button>
			<sl-button @click="${() => notify('Hello', 'neutral', 3000, 'gear')}" variant="neutral">Neutral</sl-button>
			<sl-button @click="${() => notify('Hello', 'warning', 3000, 'exclamation-triangle')}" variant="warning">Warning</sl-button>
			<sl-button @click="${() => notify('Hello', 'danger', 3000, 'exclamation-octagon')}" variant="danger">Danger</sl-button>
		`
	}
}

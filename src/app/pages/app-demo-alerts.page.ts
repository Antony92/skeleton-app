import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { notify } from '../services/notify.service'
import { confirmDialog } from '../services/confirm-dialog.service'
import { showGlobalMessage } from '../services/global-message.service'

@customElement('app-demo-alerts')
export class AppDemoAlerts extends LitElement {
	static styles = [
		css``
	]

	render() {
		return html`
			<div>
				Global message
				<sl-button variant="primary" pill @click=${() => showGlobalMessage('🔥This is global message🔥')}>Global message</sl-button>
				<br /><br />
				Confirm dialog
				<sl-button variant="primary" pill @click=${() => confirmDialog('Confirm', 'Are you sure?').then((result) => console.log(result))}>Confirm</sl-button>
				<br /><br />
				Alerts
				<sl-button pill @click=${() => notify({ message: 'Primary', variant: 'primary' })} variant="primary">Primary</sl-button>
				<sl-button pill @click=${() => notify({ message: 'Success', variant: 'success', icon: 'check2-circle' })} variant="success">Success</sl-button>
				<sl-button pill @click=${() => notify({ message: 'Neutral', variant: 'neutral', icon: 'gear' })} variant="neutral">Neutral</sl-button>
				<sl-button pill @click=${() => notify({ message: 'Warning', variant: 'warning', icon: 'exclamation-triangle' })} variant="warning">Warning</sl-button>
				<sl-button pill @click=${() => notify({ message: 'Danger', variant: 'danger', icon: 'exclamation-octagon' })} variant="danger">Danger</sl-button>
			</div>
		`
	}
}

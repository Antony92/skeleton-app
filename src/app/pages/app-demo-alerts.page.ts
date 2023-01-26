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
				<sl-button pill @click=${() => notify('Hello', 'primary', 3000, 'info-circle')} variant="primary">Primary</sl-button>
				<sl-button pill @click=${() => notify('Hello', 'success', 3000, 'check2-circle')} variant="success">Success</sl-button>
				<sl-button pill @click=${() => notify('Hello', 'neutral', 3000, 'gear')} variant="neutral">Neutral</sl-button>
				<sl-button pill @click=${() => notify('Hello', 'warning', 3000, 'exclamation-triangle')} variant="warning">Warning</sl-button>
				<sl-button pill @click=${() => notify('Hello', 'danger', 3000, 'exclamation-octagon')} variant="danger">Danger</sl-button>
			</div>
		`
	}
}

import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { notify } from '../services/notify.service'

@customElement('app-demo-toast')
export class AppDemoToast extends LitElement {
	static styles = css``

	override render() {
		return html`
			<sl-button @click=${() => notify('Hello', 'primary', 'info-circle')} variant="primary">Primary</sl-button>
			<sl-button @click=${() => notify('Hello', 'success', 'check2-circle')} variant="success">Success</sl-button>
			<sl-button @click=${() => notify('Hello', 'neutral', 'gear')} variant="neutral">Neutral</sl-button>
			<sl-button @click=${() => notify('Hello', 'warning', 'exclamation-triangle')} variant="warning">Warning</sl-button>
			<sl-button @click=${() => notify('Hello', 'danger', 'exclamation-octagon')} variant="danger">Danger</sl-button>
		`
	}
}

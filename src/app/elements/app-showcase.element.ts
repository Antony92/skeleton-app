import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { AppDialog } from './app-dialog.element'

@customElement('app-showcase')
export class AppShowcase extends LitElement {
	static styles = css``

	@property({ type: String })
	component = 'default'

	@query('app-dialog')
	appDialog!: AppDialog

	constructor() {
		super()
		this.addEventListener('app-form-change', (e: Event) => console.log('app-form-change', e))
        this.addEventListener('app-search', (e: Event) => console.log('app-search', e))
	}

	protected render() {
		return html`${choose(this.component, [
			['default', () => html`<h1>Component tests</h1>`],
			['table', () => {
				import('./app-table.element')
				return html`<app-table refresh></app-table>`
			}],
			['form', () => {
				import('./app-form.element')
				return html`<app-form></app-form>`
			}],
			['autocomplete', () => {
				import('./app-autocomplete.element')
				return html`<app-autocomplete></app-autocomplete>`
			}],
			['dialog', () => {
				import('./app-dialog.element')
				return html`
					<button @click=${() => this.appDialog.open()}>Open dialog</button>
					<app-dialog dialog-title="Hello" modal>
						<p>Do you confirm?</p>
						<button dialog-close>Close</button>
						<button dialog-close="true">Confirm</button>
					</app-dialog>
				`
			}],
		])}`
	}
}

import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { PreventCommands, Router, RouterLocation, WebComponentInterface } from '@vaadin/router'
import '@app/elements/input/app-input.element'
import '@app/elements/button/app-button.element'
import { serializeForm, setDocumentTitle } from '@app/utils/html'
import { formStyle } from '@app/styles/form.style'
import { notify } from '@app/shared/notification'
import { confirmDialog } from '@app/shared/dialog'

@customElement('app-form-page')
export class AppFormPage extends LitElement implements WebComponentInterface {
	static styles = [
		formStyle,
		css`
			.actions {
				display: flex;
				justify-content: flex-start;
				gap: 10px;
			}
		`,
	]

	@query('form')
	form!: HTMLFormElement

	hasUnsavedChanges = false

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Form')
	}

	protected async firstUpdated() {}

	async onBeforeLeave(location: RouterLocation, commands: PreventCommands, router: Router) {
		if (
			this.hasUnsavedChanges &&
			!(await confirmDialog({ header: 'Confirm', message: 'You have unsaved changes. Are you sure you want to leave the page?' }))
		) {
			console.log('tuka')
			return commands.prevent()
		}
	}

	async submit(event: SubmitEvent) {
		event.preventDefault()
		if (!this.form.checkValidity()) {
			this.form.querySelector<HTMLElement>('*:state(invalid)')?.focus()
			return
		}
		const data = serializeForm(this.form)
		this.hasUnsavedChanges = false
		notify({ message: 'Form submitted', variant: 'success' })
		console.log(data)
	}

	render() {
		return html`
			<form @submit=${this.submit} @change=${() => (this.hasUnsavedChanges = true)} novalidate>
				<app-input required name="name" label="Name"></app-input>
				<app-input required name="email" label="Email" type="email"></app-input>
				<div class="actions">
					<app-button variant="primary" @click=${() => this.form.requestSubmit()}>Submit</app-button>
					<app-button @click=${() => this.form.reset()}>Reset</app-button>
				</div>
			</form>
		`
	}
}

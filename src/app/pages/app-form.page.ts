import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import type { PreventCommands, Router, RouterLocation, WebComponentInterface } from '@vaadin/router'
import '@app/elements/input/app-input.element'
import '@app/elements/checkbox/app-checkbox.element'
import '@app/elements/radio/app-radio.element'
import '@app/elements/radio-group/app-radio-group.element'
import '@app/elements/textarea/app-textarea.element'
import '@app/elements/button/app-button.element'
import '@app/elements/select/app-select.element'
import '@app/elements/select-option/app-select-option.element'
import '@app/elements/file-upload/app-file-upload.element'
import { serializeForm, setPageTitle } from '@app/utils/html'
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
		setPageTitle('Form')
	}

	protected async firstUpdated() {}

	async onBeforeLeave(location: RouterLocation, commands: PreventCommands, router: Router) {
		if (
			this.hasUnsavedChanges &&
			!(await confirmDialog({ header: 'Confirm', message: 'You have unsaved changes. Are you sure you want to leave the page?' }))
		) {
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
				<!-- <app-input required name="name" label="Name"></app-input>
				<app-input required name="email" label="Email" type="email"></app-input>
				<app-textarea required name="textarea" label="Textarea"></app-textarea>
				<app-checkbox required name="checkbox" label="Are you sure?"></app-checkbox>
				<app-radio-group name="radio" required label="Select one radio" value="2">
					<app-radio label="Radio 1" value="1"></app-radio>
					<app-radio label="Radio 2" value="2"></app-radio>
				</app-radio-group>

				<app-select required name="select" label="Select">
					<app-select-option value="option-1">Option 1</app-select-option>
					<app-select-option value="option-2">Option 2</app-select-option>
					<app-select-option value="option-3">Option 3</app-select-option>
					<app-select-option value="option-4">Option 4</app-select-option>
					<app-select-option value="option-5">Option 5</app-select-option>
				</app-select> -->

				<app-file-upload name="file" size="1024" required accept=".ts" fileName="test.ts" fileURL="1">
					<button slot="trigger">Upload</button>
				</app-file-upload>
				
				<div class="actions">
					<app-button variant="primary" @click=${() => this.form.requestSubmit()}>Submit</app-button>
					<app-button @click=${() => this.form.reset()}>Reset</app-button>
				</div>
			</form>
		`
	}
}

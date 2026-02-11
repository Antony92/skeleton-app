import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
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
import { pageHasUnsavedChanges } from '@app/shared/navigation'

@customElement('app-form-page')
export class AppFormPage extends LitElement {
	static styles = [
		formStyle,
		css`
			.actions {
				display: flex;
				justify-content: flex-start;
				gap: 10px;
			}

			h3 {
				margin: 0 0 10px 0;
			}
		`,
	]

	@query('form')
	accessor form!: HTMLFormElement

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Form')
	}

	protected async firstUpdated() {}

	async submit(event: SubmitEvent) {
		event.preventDefault()
		if (!this.form.checkValidity()) {
			this.form.querySelector<HTMLElement>('*:state(invalid)')?.focus()
			return
		}
		const data = serializeForm(this.form)
		pageHasUnsavedChanges(false)
		notify({ message: 'Form submitted', variant: 'success' })
		console.log(data)
	}

	render() {
		return html`
			<h3>Form</h3>
			<form @submit=${this.submit} @change=${() => pageHasUnsavedChanges()} novalidate>

				<app-checkbox required name="checkbox" label="Are you sure?"></app-checkbox>

				<div class="actions">
					<app-button variant="primary" @click=${() => this.form.requestSubmit()}>Submit</app-button>
					<app-button @click=${() => this.form.reset()}>Reset</app-button>
				</div>
			</form>
		`
	}
}

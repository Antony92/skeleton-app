import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@app/elements/input/app-input.element'
import '@app/elements/button/app-button.element'
import { serializeForm, setDocumentTitle } from '@app/utils/html'
import { formStyle } from '@app/styles/form.style'

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
		`,
	]

	@query('form')
	form!: HTMLFormElement

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Form')
	}

	protected async firstUpdated() {}

	async submit(event: SubmitEvent) {
		event.preventDefault()
		if (!this.form.checkValidity()) {
			this.form.querySelector<HTMLElement>('*:state(invalid)')?.focus()
			return
		}
		const data = serializeForm(this.form)
		console.log(data)
	}

	render() {
		return html`
			<form @submit=${this.submit} novalidate>
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

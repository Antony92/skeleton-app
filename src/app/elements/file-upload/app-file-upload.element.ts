import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { appFileUploadStyle } from '@app/elements/file-upload/app-file-upload.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { type FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'
import { formatBytes } from '@app/utils/html'
import { AppFileUploadEvent } from '@app/events/file-upload.event'

@customElement('app-file-upload')
export class AppFileUpload extends LitElement implements FormControl {
	static styles = [appFileUploadStyle, css``]

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean })
	required = false

	@property({ type: String })
	name = ''

	@property({ type: String })
	accept = ''

	@property({ type: String })
	label = ''

	@property({ type: String, attribute: false })
	value = ''

	@property({ attribute: false })
	files: FileList | null = null

	@property({ type: String })
	placeholder: string | undefined

	@property({ type: Number })
	size: number | undefined

	@property({ type: String })
	fileName = ''

	@property({ type: String })
	fileURL = ''

	@state()
	private errorMessage: string = ''

	@state()
	touched = false

	@query('input')
	input!: HTMLInputElement

	@queryAssignedElements({ slot: 'trigger' })
	triggers!: HTMLElement[]

	static formAssociated = true
	formController!: FormControlController

	constructor() {
		super()
		this.formController = new FormControlController(this)
	}

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('invalid', async () => {
			this.touched = true
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		URL.revokeObjectURL(this.fileURL)
	}

	protected firstUpdated() {
		this.triggers.forEach((trigger) => trigger.addEventListener('click', () => {
			if (!this.disabled) {
				this.input.click()
			}
		}))
	}

	protected updated() {
		this.formController.setValidity(this.input.validity, this.input.validationMessage, this.input)
	}

	onChange() {
		this.touched = true
		this.files = this.input.files
		this.value = this.input.value
		this.checkFileValidation()
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.touched = false
		this.errorMessage = ''
	}

	formResetCallback() {
		this.value = ''
		this.files = null
		this.fileName = ''
		this.fileURL = ''
		this.touched = false
		this.errorMessage = ''
		URL.revokeObjectURL(this.fileURL)
		this.input.setCustomValidity('')
	}

	focus(options?: FocusOptions) {
		this.input.focus(options)
	}

	checkFileValidation() {
		const file = this.files?.[0]
		this.input.setCustomValidity('')

		if (!file) {		
			return
		}

		this.fileURL = URL.createObjectURL(file)
		this.fileName = file.name

		if (this.size && file.size > this.size) {
			this.input.setCustomValidity(`File size too large. Maximum allowed is ${formatBytes(this.size)}.`)
			return
		}

		this.dispatchEvent(new AppFileUploadEvent(file))
	}

	deleteFile() {
		this.value = ''
		this.files = null
		this.fileName = ''
		this.fileURL = ''
		this.input.setCustomValidity('')
	}

	validated(validity: ValidityState, message: string) {
		this.errorMessage = this.touched && !validity.valid ? message : ''
	}

	get form() {
		return this.formController.form
	}

	get validity() {
		return this.formController.validity
	}

	get validationMessage() {
		return this.formController.validationMessage
	}

	get willValidate() {
		return this.formController.willValidate
	}

	checkValidity() {
		return this.formController.checkValidity()
	}

	reportValidity() {
		return this.formController.reportValidity()
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				${when(this.label, () => html`<label for="input" part="label">${this.label}</label>`)}
				<div class="file-upload-wrapper" part="file-upload-wrapper">
					<slot name="trigger"></slot>
					<input
						id="input"
						hidden
						?disabled=${this.disabled}
						?required=${this.required}
						name=${ifDefined(this.name)}
						@change=${this.onChange}
						.value=${live(this.value)}
						accept=${ifDefined(this.accept)}
						type="file"
					/>
					${when(this.fileURL, () => html`
						<div>
							<a download=${this.fileName} href=${this.fileURL} @click=${() => URL.revokeObjectURL(this.fileURL)}>${this.fileName}</a>
							<button @click=${this.deleteFile}>X</button>
						</div>
					`)}
					
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-file-upload': AppFileUpload
	}
}

import { html, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { appFileUploadStyle } from '@app/elements/file-upload/app-file-upload.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { when } from 'lit/directives/when.js'
import { AppFileUploadErrorEvent, AppFileUploadEvent } from '@app/events/file-upload.event'
import { defaultStyle } from '@app/styles/default.style'
import { FormElement } from '@app/mixins/form.mixin'

@customElement('app-file-upload')
export class AppFileUpload extends FormElement {
	static styles = [defaultStyle, appFileUploadStyle, css``]

	@property({ type: Boolean, reflect: true })
	accessor disabled = false

	@property({ type: Boolean })
	accessor required = false

	@property({ type: String })
	accessor accept = ''

	@property({ type: String })
	accessor label = ''

	@property({ attribute: false })
	accessor files: FileList | null = null

	@property({ type: String })
	accessor placeholder = ''

	@property({ type: Number })
	accessor size: number | undefined

	@property({ type: String })
	accessor fileName = ''

	@property({ type: String })
	accessor fileURL = ''

	@query('input')
	accessor input!: HTMLInputElement

	@queryAssignedElements({ slot: 'trigger' })
	accessor triggers!: HTMLElement[]

	disconnectedCallback() {
		super.disconnectedCallback()
		URL.revokeObjectURL(this.fileURL)
	}

	protected firstUpdated() {
		this.triggers.forEach((trigger) =>
			trigger.addEventListener('click', () => {
				if (!this.disabled) {
					this.input.click()
				}
			}),
		)
	}

	onChange() {
		this.touched = true
		this.files = this.input.files
		this.value = this.input.value
		this.checkFileValidation()
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	formResetCallback() {
		super.formResetCallback()
		this.files = null
		this.fileName = ''
		this.fileURL = ''
		URL.revokeObjectURL(this.fileURL)
		this.input.setCustomValidity('')
	}

	focus(options?: FocusOptions) {
		this.input.focus(options)
	}

	getValidity() {
		return { flags: this.input.validity, message: this.input.validationMessage, anchor: this.input }
	}

	checkFileValidation() {
		const file = this.files?.[0]
		this.input.setCustomValidity('')

		if (!file) {
			return
		}

		const fileSizeInMB = file.size / 1024 ** 2

    if (this.size && fileSizeInMB > this.size) {
			this.setCustomError(`File size too large. Maximum allowed is ${this.size} MB.`)
			return
		}

		this.fileURL = URL.createObjectURL(file)
		this.fileName = file.name
		this.dispatchEvent(new AppFileUploadEvent(file))
	}

	setCustomError(error: string) {
		this.input.setCustomValidity(error)
		this.dispatchEvent(new AppFileUploadErrorEvent(this.input.validationMessage))
		this.value = ''
	}

	deleteFile() {
		this.value = ''
		this.files = null
		this.fileName = ''
		this.fileURL = ''
		this.input.setCustomValidity('')
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
					${when(
						this.fileURL,
						() => html`
							<div>
								<a download=${this.fileName} href=${this.fileURL}>${this.fileName}</a>
								<button @click=${this.deleteFile}>X</button>
							</div>
						`,
					)}
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-file-upload': AppFileUpload
	}
}

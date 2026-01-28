import { html, LitElement, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { appRadioStyle } from '@app/elements/radio/app-radio.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { type FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-radio')
export class AppRadio extends LitElement implements FormControl {
	static styles = [defaultStyle, appRadioStyle, css``]

	@property({ type: Boolean, reflect: true })
	accessor disabled = false

	@property({ type: Boolean })
	accessor autofocus = false

	@property({ type: Boolean })
	accessor hidden = false

	@property({ type: Boolean })
	accessor readonly = false

	@property({ type: Boolean })
	accessor required = false

	@property({ type: String })
	accessor name = ''

	@property({ type: String })
	accessor label = ''

	@property({ type: String })
	accessor value = ''

	@property({ type: String })
	accessor defaultValue = ''

	@property({ type: Boolean })
	accessor checked = false

	@state()
	private accessor errorMessage = ''

	@state()
	accessor touched = false

	@query('input')
	accessor input!: HTMLInputElement

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

	protected updated() {
		this.formController.setValidity(this.input.validity, this.input.validationMessage, this.input)
	}

	onInput() {
		this.value = this.input.value
		this.checked = this.input.checked
		this.touched = true
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }))
	}

	onChange() {
		this.value = this.input.value
		this.checked = this.input.checked
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	onBlur() {
		this.touched = true
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }))
	}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.touched = false
		this.errorMessage = ''
	}

	formResetCallback() {
		this.checked = false
		this.value = this.defaultValue || this.value
		this.touched = false
		this.errorMessage = ''
	}

	focus(options?: FocusOptions) {
		this.input.focus(options)
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
				<div class="radio-wrapper" part="radio-wrapper">
					<input
						id="radio"
						part="radio"
						.checked=${this.checked}
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
						?hidden=${this.hidden}
						?readonly=${this.readonly}
						?required=${this.required}
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.value)}
						type="radio"
					/>
					${when(this.label, () => html`<label for="radio" part="label">${this.label}</label>`)}
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.errorMessage}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-radio': AppRadio
	}
}

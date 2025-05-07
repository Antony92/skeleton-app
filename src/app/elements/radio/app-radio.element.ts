import { html, LitElement, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { appRadioStyle } from './app-radio.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'

@customElement('app-radio')
export class AppRadio extends LitElement implements FormControl {
	static styles = [appRadioStyle, css``]

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean })
	autofocus = false

	@property({ type: Boolean })
	hidden = false

	@property({ type: Boolean })
	readonly = false

	@property({ type: Boolean })
	required = false

	@property({ type: String })
	name = ''

	@property({ type: String })
	label = ''

	@property({ type: String })
	value = ''

	@property({ type: String })
	defaultValue = ''

	@property({ type: Boolean })
	checked = false

	@state()
	private errorMessage: string = ''

	@state()
	touched = false

	@query('input')
	input!: HTMLInputElement

	static formAssociated = true
	formController!: FormControlController

	constructor() {
		super()
		this.formController = new FormControlController(this)
	}

	connectedCallback(): void {
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
		this.input.checked = false
		this.value = this.defaultValue
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
				<div class="input-wrapper" part="input-wrapper">
					<input
						id="radio"
						part="radio"
						?checked=${this.checked}
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
				<small class="invalid" part="invalid" ?hidden=${this.disabled}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-radio': AppRadio
	}
}

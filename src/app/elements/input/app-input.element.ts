import { html, LitElement, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { appInputStyle } from './app-input.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { FormControl, FormControlController } from '@app/controllers/form-control.controller'

@customElement('app-input')
export class AppInput extends LitElement implements FormControl {
	static styles = [appInputStyle, css``]

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
	type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' = 'text'

	@property({ type: String })
	name = ''

	@property({ type: String })
	label = ''

	@property({ type: String })
	autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	value = ''

	@property({ type: String })
	placeholder: string | undefined

	@property()
	max: number | string | undefined

	@property()
	min: number | string | undefined

	@property({ type: Number })
	step: number | undefined

	@property({ type: Number })
	maxlength: number | undefined

	@property({ type: Number })
	minlength: number | undefined

	@property({ type: String })
	pattern: string | undefined

	@property({ type: String, attribute: 'error-message' })
	errorMessage: string = ''

	@state()
	touched = false

	static formAssociated = true

	@query('input')
	input!: HTMLInputElement

	formContol!: FormControlController

	connectedCallback(): void {
		super.connectedCallback()
		this.formContol = new FormControlController(this)
		this.addEventListener('invalid', async () => {
			this.touched = true
		})
	}

	protected updated() {
		this.formContol.setValidity(this.input.validity, this.input.validationMessage, this.input)
	}

	onInput() {
		this.value = this.input.value
		this.touched = true
	}

	onChange() {
		this.value = this.input.value
		this.touched = true
	}

	onBlur() {
		// this.touched = true
	}

	formAssociatedCallback(form: HTMLFormElement) {
		console.log(form)
	}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.touched = false
	}

	formResetCallback() {
		this.value = ''
		this.touched = false
	}

	focus(options?: FocusOptions) {
		this.input.focus(options)
	}

	get form() {
		return this.formContol.form
	}

	get validity() {
		return this.formContol.validity
	}

	get validationMessage() {
		return this.formContol.validationMessage
	}

	get willValidate() {
		return this.formContol.willValidate
	}

	checkValidity() {
		return this.formContol.checkValidity()
	}

	reportValidity() {
		return this.formContol.reportValidity()
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				<label for="input" part="label">${this.label}</label>
				<div class="input-wrapper" part="input-wrapper">
					<span class="prefix" part="prefix">
						<slot name="prefix"></slot>
					</span>
					<input
						part="input"
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
						?hidden=${this.hidden}
						?readonly=${this.readonly}
						?required=${this.required}
						autocomplete=${ifDefined(this.autocomplete)}
						placeholder=${ifDefined(this.placeholder)}
						minlength=${ifDefined(this.minlength)}
						maxlength=${ifDefined(this.maxlength)}
						min=${ifDefined(this.min)}
						max=${ifDefined(this.max)}
						step=${ifDefined(this.step)}
						type=${ifDefined(this.type)}
						pattern=${ifDefined(this.pattern)}
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.value)}
					/>
					<span class="suffix" part="suffix">
						<slot name="suffix"></slot>
					</span>
				</div>
				<small class="invalid" part="invalid">${this.validationMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-input': AppInput
	}
}

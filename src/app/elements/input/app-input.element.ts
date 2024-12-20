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
	accessor type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' = 'text'

	@property({ type: String })
	accessor name = ''

	@property({ type: String })
	accessor label = ''

	@property({ type: String })
	accessor autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	accessor value = ''

	@property({ type: String })
	accessor defaultValue = ''

	@property({ type: String })
	accessor placeholder: string | undefined

	@property()
	accessor max: number | string | undefined

	@property()
	accessor min: number | string | undefined

	@property({ type: Number })
	accessor step: number | undefined

	@property({ type: Number })
	accessor maxlength: number | undefined

	@property({ type: Number })
	accessor minlength: number | undefined

	@property({ type: String })
	accessor pattern: string | undefined

	@state()
	private accessor errorMessage: string = ''

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
		this.touched = true
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }))
	}

	onChange() {
		this.value = this.input.value
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
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
				<label for="input" part="label">${this.label}</label>
				<div class="input-wrapper" part="input-wrapper">
					<span class="prefix" part="prefix">
						<slot name="prefix"></slot>
					</span>
					<input
						id="input"
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
				<small class="invalid" part="invalid" ?hidden=${this.disabled}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-input': AppInput
	}
}

import { html, LitElement, css, PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { appInputStyle } from './app-input.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { FormControl } from '@app/controllers/form-control.controller'

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

	@property({ type: String, attribute: 'error-message' })
	accessor errorMessage: string = ''

	@state()
	accessor touched = false

	static formAssociated = true
	internals!: ElementInternals

	@query('input')
	accessor input!: HTMLInputElement

	connectedCallback(): void {
		super.connectedCallback()
		this.internals = this.attachInternals()
		this.addEventListener('invalid', async () => {
			this.touched = true
		})
	}

	protected updated(changedProperties: PropertyValues) {
		this.internals.setValidity(this.input.validity, this.input.validationMessage, this.input)
		this.internals.states.clear()
		const valid = this.internals.validity.valid
		this.internals.states.add(valid ? 'valid' : 'invalid')

		if (this.touched) {
			this.internals.states.add(valid ? 'user-valid' : 'user-invalid')
		}
		
		if (changedProperties.has('value')) {
			this.internals.setFormValue(this.value)
		}
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
		return this.internals.form
	}

	get validity() {
		return this.internals.validity
	}

	get validationMessage() {
		return this.internals.validationMessage
	}

	get willValidate() {
		return this.internals.willValidate
	}

	checkValidity() {
		return this.internals.checkValidity()
	}

	reportValidity() {
		return this.internals.reportValidity()
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

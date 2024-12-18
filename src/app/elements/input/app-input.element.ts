import { html, LitElement, css, PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { appInputStyle } from './app-input.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { live } from 'lit/directives/live.js'

@customElement('app-input')
export class AppInput extends LitElement {
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

	@property({ type: String, attribute: 'invalid-message' })
	invalidMessage: string = ''

	@state()
	private error = false

	static formAssociated = true

	private internals!: ElementInternals

	private firstUpdate = false

	@query('input')
	input!: HTMLInputElement

	connectedCallback(): void {
		super.connectedCallback()
		this.internals = this.attachInternals()
		this.addEventListener('invalid', () => {
			this.error = true
			this.setStates('invalid')
		})
	}

	protected firstUpdated() {
		this.firstUpdate = true
	}

	protected updated(changedProperties: PropertyValues): void {
		this.internals.setValidity(this.input.validity, this.input.validationMessage, this.input)
		if (changedProperties.has('value')) {
			this.internals.setFormValue(this.value)
		}
		if (!this.firstUpdate) {
			this.setStates(this.validity.valid ? 'valid' : 'invalid')
		}
		this.firstUpdate = false
	}

	onInput() {
		this.value = this.input.value
	}

	onChange() {
		this.value = this.input.value
	}

	formAssociatedCallback(form: HTMLFormElement) {
		console.log(form)
	}

	async formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.error = false
		await this.updateComplete
		this.internals.states.clear()
	}

	async formResetCallback() {
		this.value = ''
		this.error = false
		await this.updateComplete
		this.internals.states.clear()
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

	setStates(...states: string[]) {
		this.internals.states.clear()
		states.forEach(state => this.internals.states.add(state))
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
						.value=${live(this.value)}
					/>
					<span class="suffix" part="suffix">
						<slot name="suffix"></slot>
					</span>
				</div>
				${when(this.error, () => html`<small class="invalid" part="invalid">${this.validationMessage}</small>`)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-input': AppInput
	}
}

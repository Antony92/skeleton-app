import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { appInputStyle } from './app-input.style'
import { ifDefined } from 'lit/directives/if-defined.js'

@customElement('app-input')
export class AppInput extends LitElement {
	static styles = [
		appInputStyle,
		css`
			:host {
				display: block;
				max-width: 300px;
			}
		`,
	]

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean, reflect: true })
	autofocus = false

	@property({ type: Boolean, reflect: true })
	hidden = false

	@property({ type: Boolean, reflect: true })
	readonly = false

	@property({ type: Boolean, reflect: true })
	required = false

	@property({ type: String, reflect: true })
	type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' = 'text'

	@property({ type: String })
	name = ''

	@property({ type: String })
	label = ''

	@property({ type: String })
	autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	value = ''

	@property({ type: String, reflect: true })
	placeholder = ''

	@property()
	max: string | number = ''

	@property()
	min: string | number = ''

	@property({ type: Number })
	step: number | undefined

	@property({ type: Number })
	maxlength: number | undefined

	@property({ type: Number })
	minlength: number | undefined

	static formAssociated = true

	private internals!: ElementInternals

	@query('input')
	input!: HTMLInputElement

	constructor() {
		super()
		this.internals = this.attachInternals()
	}

	protected firstUpdated() {
		this.updateForm()
	}

	formResetCallback() {
		this.value = ''
		this.updateForm()
	}

	onInput() {
		this.value = this.input.value
		this.updateForm()
	}

	updateForm() {
		this.internals.setFormValue(this.value)
		this.internals.setValidity(this.input.validity, this.input.validationMessage, this.input)
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
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						.value=${this.value}
					/>
					<span class="suffix" part="suffix">
						<slot name="suffix"></slot>
					</span>
				</div>
				<div class="inavlid" part="invalid"></div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-input': AppInput
	}
}

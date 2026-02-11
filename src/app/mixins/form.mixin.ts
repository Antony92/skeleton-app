/* eslint-disable @typescript-eslint/no-unused-vars */
import { LitElement, type PropertyValues } from 'lit'
import { property, state } from 'lit/decorators.js'

type Validity = {
	flags?: ValidityStateFlags
	message?: string
	anchor?: HTMLElement
}

export interface FormControl {
	name: string
	value: string
	defaultValue: string
	disabled: boolean
	touched: boolean
	message: string

	// default form element methods
	get form(): HTMLFormElement | null
	get validity(): ValidityState
	get validationMessage(): string
	get willValidate(): boolean
	checkValidity(): boolean
	reportValidity(): boolean

	// default form internal calls
	formAssociatedCallback(form: HTMLFormElement): void
	formDisabledCallback(disabled: boolean): void
	formResetCallback(): void

	// custom form methods
	validated(validity: ValidityState, message: string): void
	getValidity(): Validity
	getFormValue(): string | null
}

export abstract class FormElement extends LitElement implements FormControl {
	@property({ type: String, reflect: true })
	accessor name = ''

	@property({ type: String })
	accessor value = ''

	@property({ type: String })
	accessor defaultValue = ''

	@property({ type: Boolean, reflect: true })
	accessor disabled = false

	@state()
	accessor touched = false

	@state()
	accessor message = ''

	internals = this.attachInternals()
	static formAssociated = true

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('invalid', async () => {
			this.touched = true
		})
	}

	abstract getValidity(): Validity

	protected updated(_changedProperties: PropertyValues): void {
		super.updated(_changedProperties)
		this.handleValidation(_changedProperties)
	}

	async handleValidation(_changedProperties: PropertyValues) {
		const validationTriggers = [
			'value',
			'name',
			'disabled',
			'touched',
			'required',
			'min',
			'max',
			'maxlength',
			'minlength',
			'type',
			'pattern',
			'checked',
		]
		const shouldValidate = validationTriggers.some((prop) => _changedProperties.has(prop))
		if (!shouldValidate) return

		await this.updateComplete

		const { flags, message, anchor } = this.getValidity()
		this.internals.setValidity(flags, message, anchor)
		this.internals.setFormValue(this.getFormValue())
		this.internals.states.clear()

		const valid = this.internals.validity.valid
		this.internals.states.add(valid ? 'valid' : 'invalid')

		if (this.touched) {
			this.internals.states.add(valid ? 'user-valid' : 'user-invalid')
		}

		this.validated(this.validity, this.validationMessage)
	}

	formAssociatedCallback(form: HTMLFormElement) {}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.touched = false
	}

	formResetCallback() {
		this.value = this.defaultValue
		this.touched = false
	}

	getFormValue() {
		return this.value || null
	}

	validated(validity: ValidityState, message: string): void {
		this.message = this.touched && !validity.valid ? message : ''
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
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LitElement, PropertyValues } from 'lit'
import { property, state } from 'lit/decorators.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T

type Validity = {
	flags?: ValidityStateFlags
	message?: string
	anchor?: HTMLElement
}

export interface FormControlInterface {
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

export const FormControl = <T extends Constructor<LitElement>>(superClass: T) => {
	class FormElement extends superClass implements FormControlInterface {
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

		protected async updated(_changedProperties: PropertyValues) {
			super.updated(_changedProperties)

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

		getValidity(): Validity {
			return {}
		}

		getFormValue() {
			return this.value
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

	return FormElement as Constructor<FormControlInterface> & T
}

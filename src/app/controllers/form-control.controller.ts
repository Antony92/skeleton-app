import type { ReactiveController, ReactiveControllerHost } from 'lit'

export interface FormControl {
	name: string
	value: string
	disabled: boolean
	touched: boolean
	formAssociatedCallback?: (form: HTMLFormElement) => void
	formDisabledCallback: (disabled: boolean) => void
	formResetCallback: () => void
	form: HTMLFormElement | null
	validity: ValidityState
	willValidate: boolean
	checkValidity: () => boolean
	reportValidity: () => boolean
	validated?: (validity: ValidityState, message: string) => void
}

export class FormControlController implements ReactiveController {
	host: ReactiveControllerHost & FormControl & HTMLElement

	private internals!: ElementInternals

	constructor(host: ReactiveControllerHost & FormControl & HTMLElement) {
		this.host = host
		this.internals = host.attachInternals()
		this.host.addController(this)
	}

	hostConnected() {}

	hostUpdate() {}

	async hostUpdated() {
		this.internals.setFormValue(this.host.value)
		this.internals.states.clear()

		const valid = this.internals.validity.valid
		this.internals.states.add(valid ? 'valid' : 'invalid')

		if (this.host.touched) {
			this.internals.states.add(valid ? 'user-valid' : 'user-invalid')
		}

		await this.host.updateComplete
		this.host.validated?.(this.validity, this.validationMessage)
	}

	hostDisconnected() {}


	setFormValue(value: string | null) {
		this.internals.setFormValue(value)
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

	setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement) {
		return this.internals.setValidity(flags, message, anchor)
	}
}

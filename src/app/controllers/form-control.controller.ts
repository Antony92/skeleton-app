import type { ReactiveController, ReactiveControllerHost } from 'lit'

type FormControlOptions = {
	autoBindValue: boolean
}
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
	options: FormControlOptions

	private internals!: ElementInternals

	constructor(host: ReactiveControllerHost & FormControl & HTMLElement, options: FormControlOptions = { autoBindValue: true }) {
		this.host = host
		this.options = options
		this.internals = host.attachInternals()
		this.host.addController(this)
	}

	hostConnected() {}

	hostUpdate() {}

	hostUpdated() {
		if (!this.options.autoBindValue) {
			return
		}
		this.setValue(this.host.value)
	}

	hostDisconnected() {}

	async setValue(value: string | null) {
		await this.host.updateComplete

		this.internals.setFormValue(value)
		this.internals.states.clear()

		const valid = this.internals.validity.valid
		this.internals.states.add(valid ? 'valid' : 'invalid')

		if (this.host.touched) {
			this.internals.states.add(valid ? 'user-valid' : 'user-invalid')
		}

		this.host.validated?.(this.validity, this.validationMessage)
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

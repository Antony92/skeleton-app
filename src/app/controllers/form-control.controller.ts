import { ReactiveController, ReactiveControllerHost } from 'lit'

export interface FormControl {
	value: string
	disabled: boolean
    touched: boolean
	formAssociatedCallback: (form: HTMLFormElement) => void
	formDisabledCallback: (disabled: boolean) => void
	formResetCallback: () => void
	form: HTMLFormElement | null
	validity: ValidityState
	validationMessage: string
	willValidate: boolean
	checkValidity: () => boolean
	reportValidity: () => boolean
}

export class FormControlController implements ReactiveController {
	host: ReactiveControllerHost & FormControl & HTMLElement

    private internals!: ElementInternals

	constructor(host: ReactiveControllerHost & FormControl & HTMLElement) {
		this.host = host
        this.internals = host.attachInternals()
		this.host.addController(this)
	}

	hostConnected() {
		
    }

	hostUpdate() {
        
    }

	async hostUpdated() {
		await this.host.updateComplete

		this.internals.states.clear()
		
		this.internals.setFormValue(this.host.value)

		const valid = this.internals.validity.valid

		this.internals.states.add(valid ? 'valid' : 'invalid')
        
		if (this.host.touched) {
			this.internals.states.add(valid ? 'user-valid' : 'user-invalid')
		}
	}

	hostDisconnected() {}

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

	setValidity(validity: ValidityState, validationMessage: string, anchor?: HTMLElement) {
		return this.internals.setValidity(validity, validationMessage, anchor)
	}
}
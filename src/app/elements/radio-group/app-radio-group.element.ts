import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { type FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'
import type { AppRadio } from '@app/elements/radio/app-radio.element'
import { appRadioGroupStyle } from '@app/elements/radio-group/app-radio-group.style'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-radio-group')
export class AppRadioGroup extends LitElement implements FormControl {
	static styles = [defaultStyle, appRadioGroupStyle, css``]

	@property({ type: Boolean, reflect: true })
	accessor disabled = false

	@property({ type: Boolean })
	accessor hidden = false

	@property({ type: Boolean })
	accessor required = false

	@property({ type: String })
	accessor name = ''

	@property({ type: String })
	accessor label = ''

	@property({ type: String })
	accessor value = ''

	@property({ type: String })
	accessor defaultValue = ''

	@state()
	private accessor errorMessage = ''

	@state()
	accessor touched = false

	@query('fieldset')
	accessor fieldset!: HTMLFieldSetElement

	@queryAssignedElements()
	accessor radios!: AppRadio[]

	static formAssociated = true
	formController!: FormControlController

	constructor() {
		super()
		this.formController = new FormControlController(this)
	}

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('invalid', async () => {
			this.touched = true
		})
		this.addEventListener('app-change', (event) => {
			const radio = event.target as AppRadio
			this.value = radio.value
			this.touched = true
		})
	}

	protected updated() {
		if (!this.value && this.required) {
			this.formController.setValidity({ valueMissing: true }, 'This field is required', this.fieldset)
		} else {
			this.formController.setValidity({})
		}
		this.radios.forEach((r) => {
			r.checked = r.value === this.value
			r.disabled = this.disabled
		})
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

	focus(options?: FocusOptions) {
		this.radios
			.filter((r) => !r.checked)
			.at(0)
			?.focus(options)
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				<fieldset ?disabled=${this.disabled} ?hidden=${this.hidden} name=${ifDefined(this.name)}>
					${when(this.label, () => html`<legend>${this.label}</legend>`)}
					<slot></slot>
				</fieldset>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.errorMessage}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-radio-group': AppRadioGroup
	}
}

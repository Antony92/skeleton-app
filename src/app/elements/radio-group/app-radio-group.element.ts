import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'
import { AppRadio } from '../radio/app-radio.element'
import { appRadioGroupStyle } from './app-radio-group.style'

@customElement('app-radio-group')
export class AppRadioGroup extends LitElement implements FormControl {
	static styles = [appRadioGroupStyle, css``]

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean })
	hidden = false

	@property({ type: Boolean })
	required = false

	@property({ type: String })
	name = ''

	@property({ type: String })
	label = ''

	@property({ type: String })
	value = ''

	@property({ type: String })
	defaultValue = ''

	@state()
	private errorMessage: string = ''

	@state()
	touched = false

	@query('fieldset')
	fieldset!: HTMLFieldSetElement

	@queryAssignedElements()
	radios!: AppRadio[]

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
		this.addEventListener('app-change', (event) => {
			const radio = event.target as AppRadio
			this.value = radio.value
			this.touched = true
			this.radios.filter(r => r.value !== radio.value).forEach(r => r.checked = false)
		})
	}

	protected firstUpdated() {
		console.log(this.radios.filter(a => a))
	}

	protected updated() {
		if (!this.value) {
			this.formController.setValidity({ valueMissing: true }, 'This field is required', this.fieldset)
		} else {
			this.formController.setValidity({})
			this.radios.filter(r => r.value === this.value).forEach(r => r.checked = true)
		}
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

	render() {
		return html`
			<div class="form-control" part="form-control">
				<fieldset ?disabled=${this.disabled} ?hidden=${this.hidden} name=${ifDefined(this.name)}>
					${when(this.label, () => html`<legend>${this.label}</legend>`)}
					<slot></slot>
				</fieldset>
				<small class="invalid" part="invalid" ?hidden=${this.disabled}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-radio-group': AppRadioGroup
	}
}

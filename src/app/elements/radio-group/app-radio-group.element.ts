import { html, LitElement, css, type PropertyValues } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import type { AppRadio } from '@app/elements/radio/app-radio.element'
import { appRadioGroupStyle } from '@app/elements/radio-group/app-radio-group.style'
import { defaultStyle } from '@app/styles/default.style'
import { FormControl } from '@app/mixins/form-control.mixin'

@customElement('app-radio-group')
export class AppRadioGroup extends FormControl(LitElement) {
	static styles = [defaultStyle, appRadioGroupStyle, css``]

	@property({ type: Boolean })
	accessor hidden = false

	@property({ type: Boolean })
	accessor required = false

	@property({ type: String })
	accessor label = ''

	@query('fieldset')
	accessor fieldset!: HTMLFieldSetElement

	@queryAssignedElements()
	accessor radios!: AppRadio[]

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('app-change', (event) => {
			const radio = event.target as AppRadio
			this.value = radio.value
			this.touched = true
		})
	}

	protected updated(_changedProperties: PropertyValues): void {
		super.updated(_changedProperties)
		this.radios.forEach((r) => {
			r.checked = !!this.value && r.value === this.value
			r.disabled = this.disabled
		})
	}

	getValidity() {
		if (!this.value && this.required) {
			return { flags: { valueMissing: true }, message: 'This field is required', anchor: this.fieldset }
		}
		return {}
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
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-radio-group': AppRadioGroup
	}
}

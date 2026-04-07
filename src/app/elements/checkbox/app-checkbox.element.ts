import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { appCheckStyle } from '@app/elements/checkbox/app-checkbox.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { when } from 'lit/directives/when.js'
import { live } from 'lit/directives/live.js'
import { defaultStyle } from '@app/styles/default.style'
import { FormElement } from '@app/mixins/form.mixin'

@customElement('app-checkbox')
export class AppCheckbox extends FormElement {
	static styles = [defaultStyle, appCheckStyle, css``]

	@property({ type: Boolean })
	accessor readonly = false

	@property({ type: Boolean })
	accessor required = false

	@property({ type: String })
	accessor label = ''

	@property({ type: Boolean })
	accessor checked = false

	@query('input')
	accessor input!: HTMLInputElement

	onInput() {
		this.checked = this.input.checked
		this.value = this.input.value
		this.touched = true
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }))
	}

	onChange() {
		this.checked = this.input.checked
		this.value = this.input.value
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	onBlur() {
		this.touched = true
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }))
  }

  getValidity() {
		return { flags: this.input.validity, message: this.input.validationMessage, anchor: this.input }
  }

  getFormValue() {
    return this.checked ? this.value || 'on' : null
  }

  formResetCallback() {
    super.formResetCallback()
		this.checked = false
	}

	focus(options?: FocusOptions) {
		this.input.focus(options)
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				<div class="checkbox-wrapper" part="checkbox-wrapper">
					<input
						id="checkbox"
						part="checkbox"
						.checked=${live(this.checked)}
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
						?readonly=${this.readonly}
						?required=${this.required}
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.value)}
						type="checkbox"
					/>
					${when(this.label, () => html`<label for="checkbox" part="label">${this.label}</label>`)}
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-checkbox': AppCheckbox
	}
}

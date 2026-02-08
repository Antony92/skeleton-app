import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { appRadioStyle } from '@app/elements/radio/app-radio.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { when } from 'lit/directives/when.js'
import { defaultStyle } from '@app/styles/default.style'
import { FormControl } from '@app/mixins/form-control.mixin'

@customElement('app-radio')
export class AppRadio extends FormControl(LitElement) {
	static styles = [defaultStyle, appRadioStyle, css``]

	@property({ type: Boolean })
	accessor autofocus = false

	@property({ type: Boolean })
	accessor hidden = false

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

  connectedCallback(): void {
    super.connectedCallback()
    this.defaultValue = this.defaultValue || this.value
  }

	onInput() {
		this.value = this.input.value
		this.checked = this.input.checked
		this.touched = true
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }))
	}

	onChange() {
		this.value = this.input.value
		this.checked = this.input.checked
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	onBlur() {
		this.touched = true
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }))
	}

  formResetCallback() {
    super.formResetCallback()
		this.checked = false
	}

	focus(options?: FocusOptions) {
		this.input.focus(options)
  }

  getValidity() {
		return { flags: this.input.validity, message: this.input.validationMessage, anchor: this.input }
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				<div class="radio-wrapper" part="radio-wrapper">
					<input
						id="radio"
						part="radio"
						.checked=${this.checked}
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
						?hidden=${this.hidden}
						?readonly=${this.readonly}
						?required=${this.required}
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.value)}
						type="radio"
					/>
					${when(this.label, () => html`<label for="radio" part="label">${this.label}</label>`)}
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-radio': AppRadio
	}
}

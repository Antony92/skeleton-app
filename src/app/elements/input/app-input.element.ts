import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { appInputStyle } from '@app/elements/input/app-input.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { when } from 'lit/directives/when.js'
import { defaultStyle } from '@app/styles/default.style'
import { FormControl } from '@app/mixins/form-control.mixin'

@customElement('app-input')
export class AppInput extends FormControl(LitElement) {
	static styles = [defaultStyle, appInputStyle, css``]

	@property({ type: Boolean })
	accessor readonly = false

	@property({ type: Boolean })
	accessor required = false

	@property({ type: String })
	accessor type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' = 'text'

	@property({ type: String })
	accessor label = ''

	@property({ type: String })
	accessor autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	accessor placeholder = ''

	@property()
	accessor max: number | string | undefined

	@property()
	accessor min: number | string | undefined

	@property({ type: Number })
	accessor step: number | undefined

	@property({ type: Number })
	accessor maxlength: number | undefined

	@property({ type: Number })
	accessor minlength: number | undefined

	@property({ type: String })
	accessor pattern: string | undefined

	@query('input')
	accessor input!: HTMLInputElement

	onInput() {
		this.value = this.input.value
		this.touched = true
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }))
	}

	onChange() {
		this.value = this.input.value
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	onBlur() {
		this.touched = true
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }))
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
				${when(this.label, () => html`<label for="input" part="label">${this.label}</label>`)}
				<div class="input-wrapper" part="input-wrapper">
					<span class="prefix" part="prefix">
						<slot name="prefix"></slot>
					</span>
					<input
						id="input"
						part="input"
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
						?readonly=${this.readonly}
						?required=${this.required}
						autocomplete=${ifDefined(this.autocomplete)}
						placeholder=${ifDefined(this.placeholder)}
						minlength=${ifDefined(this.minlength)}
						maxlength=${ifDefined(this.maxlength)}
						min=${ifDefined(this.min)}
						max=${ifDefined(this.max)}
						step=${ifDefined(this.step)}
						type=${ifDefined(this.type)}
						pattern=${ifDefined(this.pattern)}
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.value)}
					/>
					<span class="suffix" part="suffix">
						<slot name="suffix"></slot>
					</span>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-input': AppInput
	}
}

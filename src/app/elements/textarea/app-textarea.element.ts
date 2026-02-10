import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { appTextareaStyle } from '@app/elements/textarea/app-textarea.style'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { when } from 'lit/directives/when.js'
import { defaultStyle } from '@app/styles/default.style'
import { FormControl } from '@app/mixins/form-control.mixin'

@customElement('app-textarea')
export class AppTextarea extends FormControl(LitElement) {
	static styles = [defaultStyle, appTextareaStyle, css``]

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

	@property({ type: Number })
	accessor rows = 4

	@property({ type: Number })
	accessor maxlength: number | undefined

	@property({ type: Number })
	accessor minlength: number | undefined

	@query('textarea')
	accessor textarea!: HTMLTextAreaElement

	onInput() {
		this.value = this.textarea.value
		this.touched = true
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }))
	}

	onChange() {
		this.value = this.textarea.value
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	onBlur() {
		this.touched = true
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }))
	}

	focus(options?: FocusOptions) {
		this.textarea.focus(options)
	}

	getValidity() {
		return { flags: this.textarea.validity, message: this.textarea.validationMessage, anchor: this.textarea }
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				${when(this.label, () => html`<label for="textarea" part="label">${this.label}</label>`)}
				<div class="textarea-wrapper" part="textarea-wrapper">
					<textarea
						id="textarea"
						part="textarea"
						?disabled=${this.disabled}
						?autofocus=${this.autofocus}
						?readonly=${this.readonly}
						?required=${this.required}
						autocomplete=${ifDefined(this.autocomplete)}
						placeholder=${ifDefined(this.placeholder)}
						minlength=${ifDefined(this.minlength)}
						maxlength=${ifDefined(this.maxlength)}
						rows=${ifDefined(this.rows)}
						name=${ifDefined(this.name)}
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.value)}
					>
					</textarea>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-textarea': AppTextarea
	}
}

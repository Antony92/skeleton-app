import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appInputStyle } from './app-input.style'
import { ifDefined } from 'lit/directives/if-defined.js'

@customElement('app-input')
export class AppInput extends LitElement {
	static styles = [
		appInputStyle,
		css`
			:host {
				display: flex;
				flex-direction: column;
				width: 100%;
				max-width: 300px;
				gap: 5px;
			}
		`,
	]

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean, reflect: true })
	autofocus = false

	@property({ type: Boolean, reflect: true })
	hidden = false

	@property({ type: Boolean, reflect: true })
	readonly = false

	@property({ type: Boolean, reflect: true })
	required = false

	@property({ type: String, reflect: true })
	type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' = 'text'

	@property({ type: String })
	name = ''

	@property({ type: String })
	label = ''

	@property({ type: String })
	autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	value = ''

	@property({ type: String, reflect: true })
	placeholder = ''

	@property()
	max: string | number = ''

	@property()
	min: string | number = ''

	@property({ type: Number })
	step = 0

	@property({ type: Number })
	maxlength = -1

	@property({ type: Number })
	minlength = -1

	render() {
		return html`
			<label for="input" part="label">${this.label}</label>
			<div class="input" part="input-wrapper">
				<span class="prefix">
					<slot name="prefix"></slot>
				</span>
				<input
					id="input"
					part="input"
					?disabled=${this.disabled}
					?autofocus=${this.autofocus}
					?hidden=${this.hidden}
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
					name=${ifDefined(this.name)}
					.value=${this.value}
				/>
				<span class="suffix">
					<slot name="suffix"></slot>
				</span>
			</div>
			<div class="help-text"></div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-input': AppInput
	}
}

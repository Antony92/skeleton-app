import { appAutocompleteStyle } from '@app/elements/autocomplete/app-autocomplete.style';
import { FormElement } from '@app/mixins/form.mixin';
import { defaultStyle } from '@app/styles/default.style';
import { debounce } from '@app/utils/html';
import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { when } from 'lit/directives/when.js';

@customElement('app-autocomplete')
export class AppAutocomplete extends FormElement {
	static styles = [defaultStyle, appAutocompleteStyle, css``];

	@property({ type: Boolean })
	accessor readonly = false;

	@property({ type: Boolean })
	accessor required = false;

	@property({ type: String })
	accessor label = '';

	@property({ type: Number })
	accessor debounceTime = 300;

	@property({ type: String })
	accessor autocomplete: 'on' | 'off' = 'off';

	@property({ type: Array })
	accessor results: { label: string; value: string }[] = [];

	@property({ type: String })
	accessor placeholder = '';

	@property({ type: String })
	accessor search = '';

	@query('#input')
  accessor input!: HTMLInputElement;

  @query('#hidden-input')
  accessor hiddenInput!: HTMLInputElement;

	private debouncedSearch?: ReturnType<typeof debounce>;

	onInput() {
		this.search = this.input.value;
		this.dispatchEvent(new Event('app-input', { bubbles: true, composed: true }));
		const result = this.results.find((r) => r.label === this.input.value);
		if (result) {
			this.value = result.value;
		} else {
			if (!this.debouncedSearch) {
				this.debouncedSearch = debounce(
					() => this.dispatchEvent(new Event('app-search', { bubbles: true, composed: true })),
					this.debounceTime,
				);
			}
			return this.debouncedSearch();
		}
	}

	onChange() {
		const result = this.results.find((r) => r.label === this.input.value);
		this.value = result?.value || '';
		this.touched = true;
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
		this.dispatchEvent(new Event('change', { bubbles: true }));
	}

	onBlur() {
		if (!this.value) {
			this.search = '';
		}
		this.touched = true;
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }));
	}

	focus(options?: FocusOptions) {
		this.input.focus(options);
	}

	getValidity() {
		return { flags: this.hiddenInput.validity, message: this.hiddenInput.validationMessage, anchor: this.input };
  }

 	formResetCallback() {
		super.formResetCallback();
		this.search = '';
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
						@input=${this.onInput}
						@change=${this.onChange}
						@blur=${this.onBlur}
						.value=${live(this.search)}
						list="results"
					/>
					<input
						id="hidden-input"
						?disabled=${this.disabled}
						?readonly=${this.readonly}
						?required=${this.required}
						name=${ifDefined(this.name)}
						.value=${live(this.value)}
						hidden
					/>
					<span class="suffix" part="suffix">
						<slot name="suffix"></slot>
					</span>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>

			<datalist id="results">
				${this.results.map((result) => html`<option value=${result.label}></option>`)}
			</datalist>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-autocomplete': AppAutocomplete;
	}
}

import { html, LitElement, css, PropertyValueMap } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { debounceTime, Subject, Subscription } from 'rxjs'
import { appInput } from '@app/styles/input.style'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js'

@customElement('app-autocomplete')
export class AppAutocomplete extends LitElement {
	static styles = [
		appInput,
		css`
			:host {
				display: block;
			}

			.input {
				position: relative;
			}

			sl-progress-bar {
				width: 100%;
				--height: 3px;
				position: absolute;
				bottom: 0px;
			}
		`,
	]

	static formAssociated = true

	internals!: ElementInternals

	@query('input')
	input!: HTMLInputElement

	@property({ type: String, reflect: true })
	name = ''

	@property({ type: String, reflect: true })
	label = ''

	@property({ type: String, reflect: true })
	placeholder = ''

	@property({ type: Boolean, reflect: true })
	required = false

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: String, reflect: true })
	value = ''

	@property({ type: String, reflect: true })
	selected = ''

	@property({ type: Number })
	delay = 300

	@property({ type: Array })
	list: { name: string; value: string; }[] = []

	@state()
	loading = false

	#searchEvent = new Subject<string>()

	#searchSubscription: Subscription = new Subscription()

	constructor() {
		super()
		this.internals = this.attachInternals()
	}

	connectedCallback() {
		super.connectedCallback()
		this.#searchSubscription = this.#searchEvent
			.asObservable()
			.pipe(debounceTime(this.delay))
			.subscribe(() => {
				this.dispatchEvent(
					new CustomEvent('app-autocomplete-search', {
						bubbles: true,
						composed: true,
						detail: this.value,
					})
				)
			})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#searchSubscription.unsubscribe()
	}

	firstUpdated() {
		if (!this.value && !this.selected && this.required) {
			this.setInvalid()
		} else {
			this.setValid()
		}
	}

	formResetCallback() {
		this.value = ''
		this.setInvalid()
	}

	updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		if (_changedProperties.has('list')) {
			this.loading = false
		}
		if (_changedProperties.has('selected') && this.selected && this.value) {
			this.internals.setFormValue(this.selected)
			this.setValid()
		}
	}

	onInput() {
		this.selected = ''
		this.value = this.input.value.trim()
		const match = this.list.find((item) => item.name === this.value)
		if (match) {
			this.input.value = this.input.value.trim()
			this.selected = match.value
			this.internals.setFormValue(match.value)
			this.dispatchEvent(
				new CustomEvent('app-autocomplete-selected', {
					bubbles: true,
					composed: true,
					detail: match,
				})
			)
		} else {
			this.loading = true
			this.#searchEvent.next(this.value)
		}
	}

	onBlur() {
		if (!this.selected && this.required) {
			this.value = ''
			this.setInvalid()
		} else {
			this.setValid()
		}
	}

	setInvalid() {
		this.internals.setValidity({ valueMissing: true }, 'This field is required', this.input)
	}

	setValid() {
		this.internals.setValidity({})
	}

	render() {
		return html`
			${when(this.label, () => html`<label>${this.label}</label>`)}
			<div class="input">
				<input
					autocomplete="off"
					list="list"
					.name=${this.name}
					.placeholder=${this.placeholder}
					.value=${this.value}
					?required=${this.required}
					?disabled=${this.disabled}
					@input=${this.onInput}
					@blur=${this.onBlur}
				/>
				${when(this.loading, () => html`<sl-progress-bar indeterminate></sl-progress-bar>`)}
			</div>
			<datalist id="list">${this.list.map((item) => html`<option>${item.name}&nbsp;</option>`)}</datalist>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-autocomplete': AppAutocomplete
	}
}

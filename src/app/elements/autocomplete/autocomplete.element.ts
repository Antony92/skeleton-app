import { html, LitElement, css, PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { debounceTime, Subject, Subscription } from 'rxjs'
import { appInput } from '../../styles/input.style'

@customElement('app-autocomplete')
export class AppAutocomplete extends LitElement {
	static styles = [
		appInput,
		css`
			:host { 
				display: block;
			}
		`
	]

	static formAssociated = true

	internals!: ElementInternals

	@query('input')
	input!: HTMLInputElement

	@property({ type: String, reflect: true })
	name = ''

	@property({ type: String, reflect: true })
	placeholder = ''
	
	@property({ type: Boolean, reflect: true })
	required = false

	@property({ type: String })
	value = ''

	@property({ type: Number })
	delay = 300

	@property({ type: Array })
	list: { label: string, value: string }[] = []


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
				this.dispatchEvent(new CustomEvent('app-autocomplete-search', {
					bubbles: true,
					composed: true,
					detail: this.input.value
				}))
			})
	}

    disconnectedCallback() {
		super.disconnectedCallback()
		this.#searchSubscription.unsubscribe()
	}

	firstUpdated() {
		this.internals.setFormValue(this.value)
		if (!this.value && this.required) {
			this.setInvalid()
		} else {
			this.setValid()
		}
	}

	formResetCallback() {
		this.clear()
		this.setInvalid()
	}

	onInput() {
		this.value = this.input.value
		const match = this.list.find(item => item.label === this.value)
		if (match) {
			this.internals.setFormValue(match.value)
			this.dispatchEvent(new CustomEvent('app-autocomplete-selected', {
				bubbles: true,
				composed: true,
				detail: match
			}))
		} else {
			this.#searchEvent.next(this.value)
		}
	}

	onBlur() {
		if (!this.value && this.required) {
			this.setInvalid()
		} else if (!this.list.find(item => item.label === this.value) && this.required) {
			this.clear()
			this.setInvalid()
			this.#searchEvent.next(this.value)
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

	clear() {
		this.input.value = ''
		this.value = ''
	}

	render() {
		return html`
            <div class="input">
				<input 
					autocomplete="off" 
					list="list" 
					.name=${this.name}
					.placeholder=${this.placeholder}
					.value=${this.value}
					?required=${this.required}
					@input=${this.onInput}
					@blur=${this.onBlur}
				/>
				<datalist id="list">
					${this.list.map(item => html`<option>${item.label}</option>`)}
				</datalist>
			</div>	
        `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-autocomplete': AppAutocomplete
	}
}
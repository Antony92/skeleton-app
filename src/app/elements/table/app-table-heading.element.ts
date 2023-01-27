import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import { debounceTime, Subject, Subscription } from 'rxjs'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js'
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.js'

@customElement('app-table-heading')
export class AppTableHeading extends LitElement {
	static styles = css`
        :host {
            display: table-cell;
            vertical-align: bottom;
            padding: 10px;
        }

		.heading {
            display: flex;
            align-items: center;
            padding: 10px;
            gap: 5px;
            font-weight: bold;
        }

		.sortable {
			cursor: pointer;
		}

        .sortable sl-icon {
            margin-top: 3px;
        }

        .sortable sl-icon.placeholder {
            opacity: 0;
            transition: all 300ms;
            translate: 0 25%;
        }

        .sortable:not(:focus):hover sl-icon.placeholder {
            opacity: .5;
            translate: 0 0;
        }

        sl-input, sl-select {
            min-width: 200px;
        }
	`

    @property({ type: String, reflect: true })
    label: string = ''

	@property({ type: Boolean })
	sortable = false

    @property({ type: String, reflect: true })
	order: 'asc' | 'desc' | null = null

	@property({ type: Boolean })
	filterable = false

    @property({ type: String, reflect: true })
	field: string = ''

    @property({ type: String, reflect: true })
	value: string  = ''

    @property({ type: String || Array, reflect: true })
	selected: string = ''

	@property({ type: String, reflect: true })
	type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple' = 'text'

    @property({ type: Array })
    list: { label: string, value: string | boolean | number }[] = []

	@property({ type: Number, reflect: true })
	delay = 0

	#filterEvent = new Subject()

	#filterSubscription: Subscription = new Subscription()

    connectedCallback() {
		super.connectedCallback()
		this.#filterSubscription = this.#filterEvent
			.asObservable()
			.pipe(debounceTime(this.delay))
			.subscribe(() => this.dispatchFilterEvent())
	}

    disconnectedCallback() {
		super.disconnectedCallback()
		this.#filterSubscription.unsubscribe()
	}

    dispatchFilterEvent() {
        this.dispatchEvent(new CustomEvent('app-table-column-filter', {
            bubbles: true,
            composed: true,
            detail: {
                field: this.field,
                value: this.value,
                order: this.order
            }
        }))
    }

    filterColumnValue(event: CustomEvent) {
        const input = event.target as SlInput | SlSelect
        this.value = input.value?.toString()
		this.#filterEvent.next(this.value)
	}

    filterColumnOrder() {
        this.renderRoot.querySelector<HTMLElement>('.heading')?.focus()
        if (!this.order) {
			this.order = 'desc'
		} else if (this.order === 'desc') {
			this.order = 'asc'
		} else if (this.order === 'asc') {
			this.order = null
		}
        this.dispatchFilterEvent()
	}

    clearAllFilters() {
        this.clearOrderFilter()
        this.clearValueFilter()
    }

    clearOrderFilter() {
        this.order = null
    }

    clearValueFilter() {
        this.renderRoot
			.querySelectorAll('sl-input')
			.forEach((input) => (input.value = ''))
		this.renderRoot
			.querySelectorAll('sl-select')
			.forEach((select) => (select.value = select.multiple ? [] : ''))
    }

	render() {
		return html`
			<div tabindex="-1"
                class=${classMap({ heading: true, sortable: this.sortable })}  
                @click=${this.sortable ? this.filterColumnOrder : null}
            >
				<slot></slot>
                ${when(this.sortable && !this.order, () => html`<sl-icon class="placeholder" name="sort-up"></sl-icon>`)}
                ${when(this.sortable && this.order === 'desc', () => html`<sl-icon name="sort-up"></sl-icon>`)}
                ${when(this.sortable && this.order === 'asc', () => html`<sl-icon name="sort-down"></sl-icon>`)}
            </div>
			${when(this.filterable && this.type === 'text', () => html`
                <sl-input
                    filled
                    autocomplete="off"
                    clearable
                    type="text"
                    placeholder="Filter by ${this.label}"
                    .value=${this.selected || ''}
                    @sl-input=${this.filterColumnValue}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'number', () => html`
                <sl-input
                    filled
                    autocomplete="off"
                    clearable
                    type="number"
                    placeholder="Filter by ${this.label}"
                    .value=${this.selected || ''}
                    @sl-input=${this.filterColumnValue}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'date', () => html`
                <sl-input
                    filled
                    autocomplete="off"
                    clearable
                    type="date"
                    placeholder="Filter by ${this.label}"
                    .value=${this.selected || ''}
                    @sl-input=${this.filterColumnValue}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'boolean', () => html`
                <sl-select
                    filled
                    hoist
                    clearable
                    placeholder="Filter by ${this.label}"
                    .value=${this.selected || ''}
                    @sl-input=${this.filterColumnValue}
                >
                    ${this.list?.map((item) => html`<sl-option value=${item.value}>${item.label}</sl-option>`)}
                </sl-select>
            `)}
            ${when(this.filterable && this.type === 'select', () => html`
                <sl-select
                    filled
                    hoist
                    clearable
                    placeholder="Filter by ${this.label}"
                    .value=${this.selected || ''}
                    @sl-input=${this.filterColumnValue}
                >
                    ${this.list?.map((item) => html`<sl-option value=${item.value}>${item.label}</sl-option>`)}
                </sl-select>
            `)}
            ${when(this.filterable && this.type === 'select-multiple', () => html`
                <sl-select
                    filled
                    hoist
                    clearable
                    multiple
                    .maxOptionsVisible=${2}
                    .value=${this.selected || ''}
                    placeholder="Filter by ${this.label}"
                    @sl-input=${this.filterColumnValue}
                >
                    ${this.list?.map((item) => html`<sl-option value=${item.value}>${item.label}</sl-option>`)}
                </sl-select>
            `)}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-heading': AppTableHeading
	}
}
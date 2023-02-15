import { html, LitElement, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import { debounce, Subject, Subscription, timer } from 'rxjs'
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

        :host([action]) {
            width: var(--action-width, 1%);
        }

        :host([sticky]) {
			position: sticky;
			left: var(--sticky-start, 0);
			z-index: 1;
            background-color: var(--theme-background);
		}

        :host([stickyEnd]) {
			position: sticky;
			right: var(--sticky-end, 0);
			z-index: 1;
			background-color: var(--theme-background);
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
            transition: all 0.3s;
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

    @property({ type: String })
    label = ''

	@property({ type: Boolean })
	sortable = false

    @property({ type: String })
	order: 'asc' | 'desc' | null = null

	@property({ type: Boolean })
	filterable = false

    @property({ type: String })
	field = ''

    @property({ type: String })
	value = ''

	@property({ type: String, reflect: true })
	type: 'text' | 'number' | 'date' | 'select' | 'select-multiple' = 'text'

    @property({ type: Array })
    list: { label: string, value: string | boolean | number }[] = []

	@property({ type: Number })
	delay = 0

	#filterEvent = new Subject<string>()

	#filterSubscription: Subscription = new Subscription()

    connectedCallback() {
		super.connectedCallback()
		this.#filterSubscription = this.#filterEvent
			.asObservable()
			.pipe(debounce((value) => value ? timer(this.delay) : timer(0)))
			.subscribe(() => this.dispatchFilterValueEvent())
	}

    disconnectedCallback() {
		super.disconnectedCallback()
		this.#filterSubscription.unsubscribe()
	}

    dispatchFilterValueEvent() {
        this.dispatchEvent(new CustomEvent('app-table-column-filter-value', {
            bubbles: true,
            composed: true,
            detail: {
                field: this.field,
                order: this.order
            }
        }))
    }

    dispatchFilterOrderEvent() {
        this.dispatchEvent(new CustomEvent('app-table-column-filter-order', {
            bubbles: true,
            composed: true,
            detail: {
                field: this.field,
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
        this.dispatchFilterOrderEvent()
	}

    clearFilters() {
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
                    placeholder="Filter by ${this.label?.toLowerCase()}"
                    .value=${this.value}
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
                    placeholder="Filter by ${this.label?.toLowerCase()}"
                    .value=${this.value}
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
                    placeholder="Filter by ${this.label?.toLowerCase()}"
                    .value=${this.value}
                    @sl-input=${this.filterColumnValue}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'select', () => html`
                <sl-select
                    filled
                    hoist
                    clearable
                    placeholder="Filter by ${this.label?.toLowerCase()}"
                    .value=${this.value}
                    @sl-change=${this.filterColumnValue}
                >
                    ${this.list?.map((item) => html`<sl-option value=${item.value?.toString()}>${item.label}</sl-option>`)}
                </sl-select>
            `)}
            ${when(this.filterable && this.type === 'select-multiple', () => html`
                <sl-select
                    filled
                    hoist
                    clearable
                    multiple
                    .maxOptionsVisible=${1}
                    .value=${this.value.split(',')}
                    placeholder="Filter by ${this.label?.toLowerCase()}"
                    @sl-change=${this.filterColumnValue}
                >
                    ${this.list?.map((item) => html`<sl-option value=${item.value?.toString()}>${item.label}</sl-option>`)}
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
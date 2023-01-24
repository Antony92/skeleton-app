import { html, LitElement, css, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import { debounceTime, Subject, Subscription } from 'rxjs'

@customElement('app-table-heading')
export class AppTableHeading extends LitElement {
	static styles = css`
        :host {
            display: table-cell;
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
        sl-input, sl-select {
            min-width: 261px;
        }
	`

    @property({ type: String, reflect: true })
    label: string | undefined | null

	@property({ type: Boolean })
	sortable = false

    @property({ type: String, reflect: true })
	order: 'asc' | 'desc' | undefined | null

	@property({ type: Boolean })
	filterable = false

    @property({ type: String, reflect: true })
	field: string | undefined | null

    @property({ type: String, reflect: true })
	value: string | undefined | null

	@property({ type: String, reflect: true })
	type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple' | undefined | null = 'text'

    @property({ type: Array })
    values: { label: string, value: string | boolean | number }[] | undefined | null

	@property({ type: Number, reflect: true })
	delay: number | undefined | null

	private $filterEvent = new Subject()

	private filterSubscription: Subscription = new Subscription()

    override connectedCallback() {
		super.connectedCallback()
		this.filterSubscription = this.$filterEvent
			.asObservable()
			.pipe(debounceTime(this.delay || 0))
			.subscribe(() => this.dispatchFilterEvent())
	}

    override disconnectedCallback() {
		super.disconnectedCallback()
		this.filterSubscription.unsubscribe()
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

    private filterColumnValue(value: string | string[]) {
        this.value = value?.toString()
		this.$filterEvent.next(value)
	}

    private filterColumnOrder() {
        if (!this.order) {
			this.order = 'asc'
		} else if (this.order === 'asc') {
			this.order = 'desc'
		} else if (this.order === 'desc') {
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
			.querySelectorAll<HTMLElementTagNameMap['sl-input']>('sl-input')
			.forEach((input) => (input.value = ''))
		this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-select']>('sl-select')
			.forEach((select) => (select.value = select.multiple ? [] : ''))
    }

	override render() {
		return html`
			<div class=${classMap({ heading: true, sortable: this.sortable })}  @click=${() => (this.sortable ? this.filterColumnOrder() : '')}>
				<slot></slot>
                ${when(this.sortable && this.order === 'asc', () => html`<sl-icon name="sort-up"></sl-icon>`)}
                ${when(this.sortable && this.order === 'desc', () => html`<sl-icon name="sort-down"></sl-icon>`)}
			</div>
			${when(this.filterable && this.type === 'text', () => html`
                <sl-input
                    filled
                    pill
                    autocomplete="off"
                    clearable
                    type="text"
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.filterColumnValue((<HTMLElementTagNameMap['sl-input']>event.target).value)}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'number', () => html`
                <sl-input
                    filled
                    pill
                    autocomplete="off"
                    clearable
                    type="number"
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.filterColumnValue((<HTMLElementTagNameMap['sl-input']>event.target).value)}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'date', () => html`
                <sl-input
                    filled
                    pill
                    autocomplete="off"
                    clearable
                    type="date"
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.filterColumnValue((<HTMLElementTagNameMap['sl-input']>event.target).value)}
                >
                </sl-input>
            `)}
            ${when(this.filterable && this.type === 'boolean', () => html`
                <sl-select
                    pill
                    filled
                    hoist
                    clearable
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.filterColumnValue((<HTMLElementTagNameMap['sl-select']>event.target).value)}
                >
                    ${this.values?.map((v) => html`<sl-option value=${v.value}>${v.label}</sl-option>`)}
                </sl-select>
            `)}
            ${when(this.filterable && this.type === 'select', () => html`
                <sl-select
                    pill
                    filled
                    hoist
                    clearable
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.filterColumnValue((<HTMLElementTagNameMap['sl-select']>event.target).value)}
                >
                    ${this.values?.map((v) => html`<sl-option value=${v.value}>${v.label}</sl-option>`)}
                </sl-select>
            `)}
            ${when(this.filterable && this.type === 'select-multiple', () => html`
                <sl-select
                    pill
                    filled
                    hoist
                    clearable
                    multiple
                    .maxOptionsVisible=${2}
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.filterColumnValue((<HTMLElementTagNameMap['sl-select']>event.target).value)}
                >
                    ${this.values?.map((v) => html`<sl-option value=${v.value}>${v.label}</sl-option>`)}
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
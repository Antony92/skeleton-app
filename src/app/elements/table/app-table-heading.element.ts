import { html, LitElement, css } from 'lit'
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

    @property({ type: String })
    label = ''

	@property({ type: Boolean })
	sortable = false

    @property({ type: String, reflect: true })
	sort: 'asc' | 'desc' | null = null

	@property({ type: Boolean })
	filterable = false

    @property({ type: String })
	field = ''

    @property({ type: String, reflect: true })
	value = ''

	@property({ type: String })
	type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'select-multiple' = 'text'

    @property({ type: Array })
    values: { label: string, value: string }[] = []

	@property({ type: Number })
	delay = 0

	private $filterEvent = new Subject()

	private filterSubscription: Subscription | null = null

    override connectedCallback() {
		super.connectedCallback()
		this.filterSubscription = this.$filterEvent
			.asObservable()
			.pipe(debounceTime(this.delay))
			.subscribe(() => this.dispatchFilterEvent())
	}

    override disconnectedCallback() {
		super.disconnectedCallback()
		this.filterSubscription?.unsubscribe()
	}

    dispatchFilterEvent() {
        this.dispatchEvent(new CustomEvent('app-table-heading-filter', {
            bubbles: true,
            composed: true,
            detail: {
                field: this.field,
                value: this.value,
                sort: this.sort
            }
        }))
    }

    private handleFilter(value: string | string[]) {
        this.value = value?.toString()
		this.$filterEvent.next(value)
	}

    private handleSort() {
        if (!this.sort) {
			this.sort = 'asc'
		} else if (this.sort === 'asc') {
			this.sort = 'desc'
		} else if (this.sort === 'desc') {
			this.sort = null
		}
	}

    clearFilters() {
        this.sort = null
        this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-input']>('sl-input')
			.forEach((input) => (input.value = ''))
		this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-select']>('sl-select')
			.forEach((select) => (select.value = select.multiple ? [] : ''))
    }

	override render() {
		return html`
			<div class=${classMap({ heading: true, sortable: this.sortable })}  @click=${() => (this.sortable ? this.handleSort() : '')}>
				<slot></slot>
                ${when(this.sortable && this.sort === 'asc', () => html`<sl-icon name="sort-up"></sl-icon>`)}
                ${when(this.sortable && this.sort === 'desc', () => html`<sl-icon name="sort-down"></sl-icon>`)}
			</div>
			${when(this.filterable && this.type === 'text', () => html`
                <sl-input
                    filled
                    pill
                    autocomplete="off"
                    clearable
                    type="text"
                    placeholder="Filter by ${this.label}"
                    @sl-input=${(event: CustomEvent) => this.handleFilter((<HTMLElementTagNameMap['sl-input']>event.target).value)}
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
                    @sl-input=${(event: CustomEvent) => this.handleFilter((<HTMLElementTagNameMap['sl-input']>event.target).value)}
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
                    @sl-input=${(event: CustomEvent) => this.handleFilter((<HTMLElementTagNameMap['sl-input']>event.target).value)}
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
                    @sl-input=${(event: CustomEvent) => this.handleFilter((<HTMLElementTagNameMap['sl-select']>event.target).value)}
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
                    @sl-input=${(event: CustomEvent) => this.handleFilter((<HTMLElementTagNameMap['sl-select']>event.target).value)}
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
                    @sl-input=${(event: CustomEvent) => this.handleFilter((<HTMLElementTagNameMap['sl-select']>event.target).value)}
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
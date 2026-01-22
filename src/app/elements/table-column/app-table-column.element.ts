import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { when } from 'lit/directives/when.js'
import { debounce, Subject, Subscription, timer } from 'rxjs'
import { AppTableColumnFilterValueEvent, AppTableColumnFilterOrderEvent } from '@app/events/table.event'
import '@app/elements/icon/app-icon.element'
import '@app/elements/select/app-select.element'
import '@app/elements/select-option/app-select-option.element'
import '@app/elements/input/app-input.element'

@customElement('app-table-column')
export class AppTableColumn extends LitElement {
	static styles = css`
		:host {
			display: block;
			min-width: 100px;
		}

		button {
			display: flex;
			align-items: center;
			padding: 5px 0;
			gap: 5px;
			font-weight: bold;
			border: none;
			background: none;

			&.sortable {
				cursor: pointer;

				&[order='none'] {
					app-icon {
						opacity: 0;
						transition: opacity 0.3s;
					}

					&:not(:focus):hover app-icon {
						opacity: 0.5;
					}
				}

				&:not([order='none']) {
					color: var(--theme-primary-color);
				}
			}
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
	list: { label: string; value: string | boolean | number }[] = []

	@property({ type: Number })
	delay = 0

	private filterEvent = new Subject<string>()

	private filterSubscription: Subscription = new Subscription()

	connectedCallback() {
		super.connectedCallback()
		this.filterSubscription = this.filterEvent
			.asObservable()
			.pipe(debounce((value) => (value ? timer(this.delay) : timer(0))))
			.subscribe(() => this.dispatchFilterValueEvent())
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.filterSubscription.unsubscribe()
	}

	dispatchFilterValueEvent() {
		this.dispatchEvent(new AppTableColumnFilterValueEvent({ field: this.field, value: this.value }))
	}

	dispatchFilterOrderEvent() {
		this.dispatchEvent(new AppTableColumnFilterOrderEvent({ field: this.field, order: this.order }))
	}

	filterColumnValue(event: Event) {
		const input = event.target as HTMLInputElement | HTMLSelectElement
		this.value = input.value?.toString()
		this.filterEvent.next(this.value)
	}

	filterColumnOrder() {
		if (!this.sortable) return

		if (!this.order) {
			this.order = 'asc'
		} else if (this.order === 'asc') {
			this.order = 'desc'
		} else if (this.order === 'desc') {
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
		this.renderRoot.querySelectorAll('app-input').forEach((input) => (input.value = ''))
		this.renderRoot.querySelectorAll('app-select').forEach((select) => (select.value = ''))
	}

	render() {
		return html`
			<button order=${this.order || 'none'} class=${classMap({ sortable: this.sortable })} @click=${this.filterColumnOrder}>
				<slot></slot>
				${when(this.sortable && !this.order, () => html`<app-icon>sort</app-icon>`)}
				${when(this.sortable && this.order === 'desc', () => html`<app-icon>arrow_downward_alt</app-icon>`)}
				${when(this.sortable && this.order === 'asc', () => html`<app-icon>arrow_upward_alt</app-icon>`)}
			</button>
			${when(
				this.filterable && this.type === 'text',
				() => html`
					<app-input placeholder="Filter by ${this.label?.toLowerCase()}" .value=${this.value} @app-input=${this.filterColumnValue}>
					</app-input>
				`,
			)}
			${when(
				this.filterable && this.type === 'number',
				() => html`
					<app-input
						type="number"
						placeholder="Filter by ${this.label?.toLowerCase()}"
						.value=${this.value}
						@app-input=${this.filterColumnValue}
					>
					</app-input>
				`,
			)}
			${when(
				this.filterable && this.type === 'date',
				() => html`
					<app-input
						type="date"
						placeholder="Filter by ${this.label?.toLowerCase()}"
						.value=${this.value}
						@cc-input=${this.filterColumnValue}
					>
					</app-input>
				`,
			)}
			${when(
				this.filterable && this.type === 'select',
				() => html`
					<app-select placeholder="Filter by ${this.label?.toLowerCase()}" @app-change=${this.filterColumnValue} .value=${this.value}>
						${this.list?.map((item) => html`<app-select-option value=${item.value?.toString()}>${item.label}</<app-select-option>`)}
					</app-select>
				`,
			)}
			${when(
				this.filterable && this.type === 'select-multiple',
				() => html`
					<app-select
						multiple
						placeholder="Filter by ${this.label?.toLowerCase()}"
						@app-change=${this.filterColumnValue}
						.value=${this.value}
					>
						${this.list?.map((item) => html`<app-select-option value=${item.value?.toString()}>${item.label}</<app-select-option>`)}
					</app-select>
				`,
			)}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-column': AppTableColumn
	}
}

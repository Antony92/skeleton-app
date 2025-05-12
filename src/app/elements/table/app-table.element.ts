import { html, LitElement, css } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { AppTableFilterEvent } from '@app/events/table.event'
import '@app/elements/button/app-button.element'
import '@app/elements/icon/app-icon.element'
import '@app/elements/input/app-input.element'
import type { AppInput } from '@app/elements/input/app-input.element'
import { debounce, Subject, Subscription, timer } from 'rxjs'

@customElement('app-table')
export class AppTable extends LitElement {
	static styles = [
		css`
			::slotted(app-paginator) {
				margin-top: 5px;
				justify-content: flex-end;
			}

			.table-container {
				overflow-x: auto;
			}

			.actions-container {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
				margin-bottom: 10px;

				app-input {
					width: 300px;
				}

				.actions {
					display: flex;
					gap: 10px;
					flex-grow: 1;

					.clear-filters {
						margin-left: auto;
					}
				}
			}
		`,
	]

	@property({ type: Boolean })
	searchable = false

	@property({ type: Boolean })
	clearable = false

	@property({ type: String })
	searchValue = ''

	@property({ type: Boolean })
	filtersApplied = false

	@queryAssignedElements({ slot: 'table', selector: 'table' })
	tables!: HTMLTableElement[]

	private searchParamsMap = new Map()
	private searchEvent = new Subject<string>()
	private searchSubscription: Subscription = new Subscription()

	connectedCallback() {
		super.connectedCallback()
		if (this.searchValue) {
			this.searchParamsMap.set('search', this.searchValue)
		}
		this.addEventListener('app-table-column-filter-value', (event) => {
			const { field, value } = event.filter
			if (value) {
				this.searchParamsMap.set(field, value)
			} else {
				this.searchParamsMap.delete(field)
			}
			this.filtersApplied = this.hasFiltersApplied()
			this.dispatchEvent(new AppTableFilterEvent(this.searchParamsMap))
		})
		this.addEventListener('app-table-column-filter-order', (event) => {
			const { field, order } = event.filter
			this.columnFilters.filter((filter) => filter !== event.target).forEach((filter) => filter.clearOrderFilter())
			if (order) {
				this.searchParamsMap.set('sort', field)
				this.searchParamsMap.set('order', order)
			} else {
				this.searchParamsMap.delete('sort')
				this.searchParamsMap.delete('order')
			}
			this.filtersApplied = this.hasFiltersApplied()
			this.dispatchEvent(new AppTableFilterEvent(this.searchParamsMap))
		})
		this.searchSubscription = this.searchEvent
			.asObservable()
			.pipe(debounce((value) => (value ? timer(300) : timer(0))))
			.subscribe(() => this.dispatchEvent(new AppTableFilterEvent(this.searchParamsMap)))
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.searchSubscription.unsubscribe()
	}

	search(value: string) {
		if (value) {
			this.searchParamsMap.set('search', value)
		} else {
			this.searchParamsMap.delete('search')
		}
		this.filtersApplied = this.hasFiltersApplied()
		this.searchEvent.next(value)
	}

	hasFiltersApplied() {
		return this.searchParamsMap.size > 0
	}

	clearAllFilters() {
		this.filtersApplied = false
		this.searchParamsMap.clear()
		this.searchValue = ''
		this.renderRoot.querySelectorAll('app-input').forEach((input) => (input.value = ''))
		this.columnFilters.forEach((columFilter) => columFilter.clearFilters())
		this.dispatchEvent(new Event('app-table-clear'))
	}

	get columnFilters() {
		const table = this.tables[0]
		return Array.from(table?.querySelectorAll('app-table-column-filter') || [])
	}

	render() {
		return html`
			<div class="actions-container">
				${when(
					this.searchable,
					() => html`
						<app-input
							autocomplete="off"
							.value=${this.searchValue}
							placeholder="Search"
							@app-input=${(event: Event) => this.search((event.target as AppInput).value)}
						>
							<app-icon slot="prefix" filled>search</app-icon>
						</app-input>
					`
				)}
				<div class="actions">
					<slot name="actions"></slot>
					${when(
						this.clearable,
						() => html`
							<app-button
								class="clear-filters"
								variant="primary"
								outlined
								@click=${this.clearAllFilters}
								?disabled=${!this.filtersApplied}
							>
								<app-icon filled>filter_alt_off</app-icon>
								Clear filters
							</app-button>
						`
					)}
				</div>
			</div>
			<div class="table-container">
				<slot name="table"></slot>
			</div>
			<slot name="paginator"></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table': AppTable
	}
}

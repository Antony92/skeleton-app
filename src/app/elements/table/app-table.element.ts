import { html, LitElement, css } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { AppTableFilterEvent } from '@app/events/table.event'
import '@app/elements/button/app-button.element'
import '@app/elements/icon/app-icon.element'
import '@app/elements/input/app-input.element'
import type { AppInput } from '@app/elements/input/app-input.element'
import { defaultStyle } from '@app/styles/default.style'
import { debounce } from '@app/utils/html'

@customElement('app-table')
export class AppTable extends LitElement {
	static styles = [
		defaultStyle,
		css`
			::slotted(app-paginator) {
				margin-top: 10px;
				justify-content: flex-end;
			}

			.table-container {
				overflow-x: auto;
			}

			.actions-container {
				display: flex;
				align-items: center;
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
	accessor searchable = false

	@property({ type: Boolean })
	accessor clearable = false

	@property({ type: String })
	accessor searchValue = ''

	@property({ type: Boolean })
	accessor filtersApplied = false

	@queryAssignedElements({ slot: 'table', selector: 'table' })
	accessor tables!: HTMLTableElement[]

  private searchParamsMap = new Map()
  private debouncedSearch?: ReturnType<typeof debounce>

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('app-table-column-filter-value', (event) => {
			const { field, value } = event.filter
			if (value) {
				this.searchParamsMap.set(field, value)
			} else {
				this.searchParamsMap.delete(field)
			}
			this.filtersApplied = this.hasFiltersApplied()
			this.dispatchFilterEvent()
		})
		this.addEventListener('app-table-column-filter-order', (event) => {
			const { field, order } = event.filter
			this.columns.filter((column) => column !== event.target).forEach((column) => column.clearOrderFilter())
			if (order) {
				this.searchParamsMap.set('sort', field)
				this.searchParamsMap.set('order', order)
			} else {
				this.searchParamsMap.delete('sort')
				this.searchParamsMap.delete('order')
			}
			this.filtersApplied = this.hasFiltersApplied()
			this.dispatchFilterEvent()
		})
		if (this.searchValue) {
			this.searchParamsMap.set('search', this.searchValue)
		}
  }

 	private search(value: string) {
    if (value) {
			this.searchParamsMap.set('search', value)
		} else {
			this.searchParamsMap.delete('search')
		}
		this.filtersApplied = this.hasFiltersApplied()
		if (!this.debouncedSearch) {
			this.debouncedSearch = debounce(() => this.dispatchFilterEvent(), 300)
		}
		return this.debouncedSearch()
	}

	hasFiltersApplied() {
		return this.searchParamsMap.size > 0
	}

	dispatchFilterEvent() {
		this.dispatchEvent(new AppTableFilterEvent(new Map([...this.searchParamsMap])))
	}

	clearAllFilters() {
		this.filtersApplied = false
		this.searchParamsMap.clear()
		this.searchValue = ''
		this.renderRoot.querySelectorAll('app-input').forEach((input) => (input.value = ''))
		this.columns.forEach((column) => column.clearFilters())
		this.dispatchEvent(new Event('app-table-clear'))
	}

	get columns() {
		const table = this.tables[0]
		return Array.from(table?.querySelectorAll('app-table-column') || [])
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
					`,
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
						`,
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

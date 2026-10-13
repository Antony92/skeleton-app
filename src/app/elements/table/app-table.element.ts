import { css, html, LitElement } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '@app/elements/button/app-button.element';
import '@app/elements/icon/app-icon.element';
import '@app/elements/input/app-input.element';
import type { AppInput } from '@app/elements/input/app-input.element';
import { AppTableFilterEvent, type AppTableHeaderFilterEvent } from '@app/events/table.event';
import { defaultStyle } from '@app/styles/default.style';
import type { TableColumn } from '@app/types/table.type';
import { debounce } from '@app/utils/html';

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

			header {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 10px;
				margin-bottom: 10px;

				h3 {
					margin: 0;
				}

				app-input {
					width: 100%;

					@media (min-width: 768px) {
						width: 300px;
					}
				}

				.actions {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 10px;
					width: 100%;

					@media (min-width: 768px) {
						margin-left: auto;
						width: fit-content;
					}
				}
			}
		`,
	];

	@property({ type: String })
	accessor header = '';

	@property({ type: Boolean })
	accessor searchable = false;

	@property({ type: Boolean })
	accessor clearable = false;

	@property({ type: Map })
	accessor filtersMap = new Map();

	@property({ type: Array })
	accessor columns: TableColumn[] = [];

	@queryAssignedElements({ slot: 'table', selector: 'table' })
	accessor tables!: HTMLTableElement[];

	@state()
	accessor filtersApplied = false;

	@state()
	accessor searchValue = '';

	private debouncedSearch?: ReturnType<typeof debounce>;

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('app-table-header-filter', (event) => {
			event.stopPropagation();
			const { type } = event.filter;
			if (type === 'order') this.onHeaderOrderFilter(event);
			if (type === 'value') this.onHeaderValueFilter(event);
			this.filtersApplied = this.hasFiltersApplied();
			this.dispatchFilterEvent();
		});
		this.filtersApplied = this.hasFiltersApplied();
		this.syncColumnsWithFilters();
	}

	syncColumnsWithFilters() {
		this.searchValue = this.filtersMap.get('search') ?? '';
		this.filtersMap.forEach((value, key) => {
			const column = this.columns.find((col) => col.field === key);
			if (column) column.value = value;
			if (key === 'sort') {
				const sortColumn = this.columns.find((col) => col.field === value);
				if (sortColumn) sortColumn.order = this.filtersMap.get('order');
			}
		});
	}

	search(value: string) {
		if (value) {
			this.filtersMap.set('search', value);
		} else {
			this.filtersMap.delete('search');
		}
		this.searchValue = value;
		this.filtersApplied = this.hasFiltersApplied();
		if (!this.debouncedSearch) {
			this.debouncedSearch = debounce(() => this.dispatchFilterEvent(), 300);
		}
		return this.debouncedSearch();
	}

	clearSearch() {
		this.searchValue = '';
		this.filtersMap.delete('search');
		this.dispatchFilterEvent();
	}

	hasFiltersApplied() {
		return this.filtersMap.size > 0;
	}

	dispatchFilterEvent() {
		const filters = new Map([...this.filtersMap]);
		this.dispatchEvent(new AppTableFilterEvent(filters));
	}

	clearAllFilters() {
		this.filtersMap.clear();
		this.filtersApplied = false;
		this.searchValue = '';
		this.headers.forEach((header) => {
			header.clearFilters();
		});
		this.columns.forEach((column) => {
			column.order = null;
			column.value = '';
		});
		this.dispatchFilterEvent();
		this.dispatchEvent(new Event('app-table-clear'));
	}

	get headers() {
		const table = this.tables[0];
		return Array.from(table?.querySelectorAll('app-table-header') || []);
	}

	onHeaderValueFilter(event: AppTableHeaderFilterEvent) {
		const { field, value } = event.filter;
		if (value) {
			this.filtersMap.set(field, value);
		} else {
			this.filtersMap.delete(field);
		}
	}

	onHeaderOrderFilter(event: AppTableHeaderFilterEvent) {
		const { field, order } = event.filter;
		if (order) {
			this.filtersMap.set('sort', field);
			this.filtersMap.set('order', order);
		} else {
			this.filtersMap.delete('sort');
			this.filtersMap.delete('order');
		}
		this.headers
			.filter((header) => header !== event.target)
			.forEach((header) => {
				header.clearOrderFilter();
			});
	}

	render() {
		return html`
			<header>
			  <h3>${this.header}</h3>
				<div class="actions">
					${when(
						this.searchable,
						() => html`
							<app-input
								autocomplete="off"
								.value=${this.searchValue}
								clearable
								placeholder="Search"
								@app-input=${(event: Event) => this.search((event.target as AppInput).value)}
								@app-clear=${this.clearSearch}
							>
								<app-icon slot="prefix" filled>search</app-icon>
							</app-input>
						`,
					)}
					<slot name="actions"></slot>
					${when(
						this.clearable,
						() => html`
							<app-button
								variant="primary"
								appearance="outlined"
								@click=${this.clearAllFilters}
								?disabled=${!this.filtersApplied}
							>
								<app-icon filled>filter_alt_off</app-icon>
								Clear filters
							</app-button>
						`,
					)}
				</div>
			</header>
			<div class="table-container">
				<slot name="table"></slot>
			</div>
			<slot name="paginator"></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table': AppTable;
	}
}

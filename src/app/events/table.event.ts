import { TableColumnFilterOrder, TableColumnFilterValue } from '../types/table.type'

export class AppTableColumnFilterValueEvent extends Event {
	readonly filter: TableColumnFilterValue

	constructor(filter: TableColumnFilterValue) {
		super('app-table-column-filter-value', { bubbles: true })
		this.filter = filter
	}
}

export class AppTableColumnFilterOrderEvent extends Event {
	readonly filter: TableColumnFilterOrder

	constructor(filter: TableColumnFilterOrder) {
		super('app-table-column-filter-order', { bubbles: true })
		this.filter = filter
	}
}

export class AppTableFilterEvent extends Event {
	readonly filters: Map<string, string>

	constructor(filters: Map<string, string>) {
		super('app-table-filter', { bubbles: true })
		this.filters = filters
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		'app-table-column-filter-value': AppTableColumnFilterValueEvent
		'app-table-column-filter-order': AppTableColumnFilterOrderEvent
		'app-table-filter': AppTableFilterEvent
	}
}

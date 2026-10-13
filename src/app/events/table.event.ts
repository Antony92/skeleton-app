import type { TableHeaderFilter } from '@app/types/table.type';

export class AppTableHeaderFilterEvent extends Event {
	readonly filter: TableHeaderFilter;

	constructor(filter: TableHeaderFilter) {
		super('app-table-header-filter', { bubbles: true, composed: true });
		this.filter = filter;
	}
}

export class AppTableFilterEvent extends Event {
	readonly filters: Map<string, string>;

	constructor(filters: Map<string, string>) {
		super('app-table-filter', { bubbles: true, composed: true });
		this.filters = filters;
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		'app-table-header-filter': AppTableHeaderFilterEvent;
		'app-table-filter': AppTableFilterEvent;
	}
}

import { PaginateValue } from '@app/types/paginate.type'

export class AppPaginateEvent extends Event {
	readonly value: PaginateValue

	constructor(value: PaginateValue) {
		super('app-paginate', { bubbles: true, composed: true })
		this.value = value
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		'app-paginate': AppPaginateEvent
	}
}

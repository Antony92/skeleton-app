export class AppSelectEvent extends Event {
	readonly value: string

	constructor(value: string) {
		super('app-select', { bubbles: true, composed: true })
		this.value = value
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		'app-select': AppSelectEvent
	}
}

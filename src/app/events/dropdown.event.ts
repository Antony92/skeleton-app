export class AppDropdownItemSelectedEvent extends Event {
    readonly value: string

    constructor(value: string) {
        super('app-dropdown-item-selected', { bubbles: true, composed: true })
        this.value = value
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'app-dropdown-item-selected': AppDropdownItemSelectedEvent
    }
}

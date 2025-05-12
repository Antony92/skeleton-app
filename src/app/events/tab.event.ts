export class AppTabChangeEvent extends Event {
    readonly value: string

    constructor(value: string) {
        super('app-tab-change', { bubbles: true, composed: true })
        this.value = value
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'app-tab-change': AppTabChangeEvent
    }
}

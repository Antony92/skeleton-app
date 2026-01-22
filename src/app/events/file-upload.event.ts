export class AppFileUploadEvent extends Event {
	readonly value: File

	constructor(value: File) {
		super('app-file-upload', { bubbles: true, composed: true })
		this.value = value
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		'app-file-upload': AppFileUploadEvent
	}
}

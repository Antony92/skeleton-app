export class AppFileUploadEvent extends Event {
	readonly value: File

	constructor(value: File) {
		super('app-file-upload', { bubbles: true, composed: true })
		this.value = value
	}
}

export class AppFileUploadErrorEvent extends Event {
	readonly message: string

	constructor(message: string) {
		super('app-file-upload-error', { bubbles: true, composed: true })
		this.message = message
	}
}
declare global {
	interface GlobalEventHandlersEventMap {
		'app-file-upload': AppFileUploadEvent
	}
}

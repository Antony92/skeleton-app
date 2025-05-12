import type { RichTextEditorValue } from '@app/types/rich-text-editor.type'

export class AppRichTextEditorChangeEvent extends Event {
	readonly value: RichTextEditorValue

	constructor(value: RichTextEditorValue) {
		super('app-rich-text-editor-change', { bubbles: true, composed: true })
		this.value = value
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		'app-rich-text-editor-change': AppRichTextEditorChangeEvent
	}
}

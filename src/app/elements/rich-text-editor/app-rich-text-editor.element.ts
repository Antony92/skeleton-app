import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type Quill from 'quill'
import { AppRichTextEditorChangeEvent } from '@app/events/rich-text-editor.event'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-rich-text-editor')
export class AppRichTextEditor extends LitElement {
	static styles = [
		defaultStyle,
		css`
			iframe {
				border: none;
				width: 500px;
				height: 200px;
			}
		`,
	]

	@query('iframe')
	iframe!: HTMLIFrameElement

	@property({ type: String })
	placeholder = ''

	@property({ type: String })
	value = ''

	protected firstUpdated() {
		this.iframe.addEventListener('load', () => {
			const iframeWindow = this.iframe.contentWindow as Window & { quill: Quill }

			const quill = iframeWindow.quill

			// set initial value
			quill.setContents(quill.clipboard.convert({ html: this.value }), 'silent')

			// text change listener
			quill.on('text-change', () => {
				const text = quill.getText().trim()
				const html = quill.getSemanticHTML()
				this.value = text ? html : ''
				this.dispatchEvent(new AppRichTextEditorChangeEvent({ text, html }))
			})
		})
	}

	render() {
		return html` <iframe src="quill.html?placeholder=${this.placeholder}" scrolling="no"></iframe> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-rich-text-editor': AppRichTextEditor
	}
}

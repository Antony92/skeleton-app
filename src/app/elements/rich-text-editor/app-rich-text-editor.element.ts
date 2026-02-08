import { html, LitElement, css, type PropertyValues } from 'lit'
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

  @property({ type: Boolean })
  accessor disabled = false

	@query('iframe')
	accessor iframe!: HTMLIFrameElement

	@property({ type: String })
	accessor placeholder = ''

	@property({ type: String })
  accessor value = ''

  @property({ type: String })
  accessor toolbar = 'header text list link clear'

  quill!: Quill
  isInternalChange = false

	protected firstUpdated() {
		this.iframe.addEventListener('load', () => {
			const iframeWindow = this.iframe.contentWindow as Window & { quill: Quill }

			this.quill = iframeWindow.quill

			// set initial value
			this.quill.setContents(this.quill.clipboard.convert({ html: this.value }), 'silent')

			// text change listener
			this.quill.on('text-change', () => {
				const text = this.quill.getText().trim()
        const html = this.quill.getSemanticHTML()
				this.isInternalChange = true
        this.value = text ? html : ''
				this.dispatchEvent(new AppRichTextEditorChangeEvent({ text, html }))
			})
		})
  }

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('value') && !this.isInternalChange && this.quill) {
      this.quill.setContents(this.quill.clipboard.convert({ html: this.value }), 'silent')
    }
    if (_changedProperties.has('disabled') && this.disabled && this.quill) {
      this.quill.disable()
    }
    if (_changedProperties.has('disabled') && !this.disabled && this.quill && !this.quill.isEnabled()) {
      this.quill.enable()
    }
    this.isInternalChange = false
  }

	render() {
		return html` <iframe src="quill.html?toolbar=${this.toolbar}&placeholder=${this.placeholder}" scrolling="no"></iframe> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-rich-text-editor': AppRichTextEditor
	}
}

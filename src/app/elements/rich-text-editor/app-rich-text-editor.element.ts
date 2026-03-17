import { html, LitElement, css, type PropertyValues, render } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import type Quill from 'quill'
import { AppRichTextEditorChangeEvent } from '@app/events/rich-text-editor.event'
import { defaultStyle } from '@app/styles/default.style'
import quillStyles from 'quill/dist/quill.snow.css?inline'
import quillScript from 'quill/dist/quill.js?url'

@customElement('app-rich-text-editor')
export class AppRichTextEditor extends LitElement {
	static styles = [
		defaultStyle,
		css`
			iframe {
				border: none;
				width: 500px;
				height: 200px;
				background: white;
			}
		`,
	]

	@property({ type: Boolean })
	disabled = false

	@query('iframe')
	iframe!: HTMLIFrameElement

	@state()
	srcdoc = ''

	@property({ type: String })
	placeholder = ''

	@property({ type: String })
	value = ''

	@property({ type: String })
	toolbar = 'header text list link color clear'

	quill!: Quill
	isInternalChange = false

	connectedCallback(): void {
		super.connectedCallback()
		this.srcdoc = this.createSrcdoc()
	}

	protected firstUpdated() {
		this.iframe.addEventListener('load', () => {
			const iframeWindow = this.iframe!.contentWindow as Window & { quill: Quill }

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

	createSrcdoc() {
		const raw = html`
			<style>
				body {
					margin: 0;
					padding: 0;
				}

				#editor {
					height: calc(100vh - 42px);
				}

				${quillStyles}
			</style>
			<div id="editor"></div>
			<script type="module" src=${quillScript}></script>
			<script type="module">
				// Params
				const params = {
					toolbar: window.frameElement.getAttribute('toolbar'),
					placeholder: window.frameElement.getAttribute('placeholder'),
				}

				// Default toolbar
				let toolbar = params?.toolbar?.split(' ') || ['header', 'text', 'list', 'link', 'color', 'clear']

				// Toolbar mapping
				toolbar = toolbar.map((value) => {
					if (value === 'header') {
						return [{ header: [1, 2, false] }]
					}
					if (value === 'text') {
						return ['bold', 'italic', 'underline']
					}
					if (value === 'list') {
						return [{ list: 'ordered' }, { list: 'bullet' }]
					}
					if (value === 'link') {
						return ['link']
					}
					if (value === 'clear') {
						return ['clean']
					}
					if (value === 'color') {
						return [{ color: [] }]
					}
				})

				const quill = new Quill('#editor', {
					placeholder: params?.placeholder,
					theme: 'snow',
					modules: {
						toolbar,
						keyboard: {
							bindings: {
								tab: {
									key: 9,
									handler: () => {
										// Handle tab
										// quil handles tab key in order to add indentation
										// this reverts default tab behaviour to focus next interactable element in dom
										return true
									},
								},
							},
						},
					},
				})

				window.quill = quill
			</script>
		`
		const temp = document.createElement('div')
		render(raw, temp)
		return temp.innerHTML
	}

	render() {
		return html` <iframe .srcdoc=${this.srcdoc} placeholder=${this.placeholder} toolbar=${this.toolbar}></iframe> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-rich-text-editor': AppRichTextEditor
	}
}

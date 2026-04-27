import { html, css, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { AppRichTextEditorChangeEvent } from '@app/events/rich-text-editor.event'
import { defaultStyle } from '@app/styles/default.style'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import { appRichTextEditorStyle } from '@app/elements/rich-text-editor/app-rich-text-editor.style'
import { FormElement } from '@app/mixins/form.mixin'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { when } from 'lit/directives/when.js'

@customElement('app-rich-text-editor')
export class AppRichTextEditor extends FormElement {
	static styles = [defaultStyle, appRichTextEditorStyle, css``]

	@property({ type: Boolean })
	accessor disabled = false

	@property({ type: String })
	accessor placeholder = ''

	@property({ type: String })
	accessor label = ''

	@property({ type: String })
	accessor toolbar = 'header text list link color clear'

	@property({ type: Boolean })
	accessor required = false

	@query('textarea')
	accessor textarea!: HTMLTextAreaElement

  editor: Editor | null = null
	isInternalChange = false

	protected firstUpdated() {
		this.editor = new Editor({
			element: this.renderRoot.querySelector('#editor'),
			extensions: [StarterKit, Placeholder.configure({ placeholder: this.placeholder })],
      onUpdate: () => {
        this.isInternalChange = true
				const html = this.editor?.getHTML() ?? ''
        const text = this.editor?.getText() ?? ''
				console.log(html, text)
        this.value = html
				this.dispatchEvent(new AppRichTextEditorChangeEvent({ html, text }))
			},
		})
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		this.editor?.destroy()
	}

	protected updated(_changedProperties: PropertyValues) {
		if (_changedProperties.has('value') && !this.isInternalChange) {
			this.editor?.commands.setContent(this.value, { emitUpdate: false })
		}
		if (_changedProperties.has('disabled')) {
			this.editor?.setOptions({ editable: !this.disabled })
		}
	}

	getValidity() {
		return { flags: this.textarea.validity, message: this.textarea.validationMessage, anchor: this.textarea }
	}

	clearAll() {
		this.editor?.commands.clearContent(true)
	}

	clearSelection() {
		this.editor?.chain().focus().unsetAllMarks().run()
	}

	focus() {
		this.editor?.commands.focus()
	}

	blur() {
		this.editor?.commands.blur()
	}

	toggleBold() {
		this.editor?.chain().toggleBold().focus().run()
	}

	toggleItalic() {
		this.editor?.chain().toggleItalic().focus().run()
	}

	toggleUnderline() {
		this.editor?.chain().toggleUnderline().focus().run()
	}

	toggleStrike() {
		this.editor?.chain().toggleStrike().focus().run()
	}

	toggleHeadingLevel(level: 1 | 2 | 3 | 4 | 5 | 6) {
		this.editor?.chain().toggleHeading({ level }).focus().run()
	}

	toggleBulletList() {
		this.editor?.chain().toggleBulletList().focus().run()
	}

	toggleOrderedList() {
		this.editor?.chain().toggleOrderedList().focus().run()
	}

	setHorizontalRule() {
		this.editor?.chain().setHorizontalRule().focus().run()
	}

	toggleBlockquote() {
		this.editor?.chain().toggleBlockquote().focus().run()
	}

	undo() {
		this.editor?.chain().focus().undo().run()
	}

	redo() {
		this.editor?.chain().focus().redo().run()
	}

	toggleLink() {
		if (this.editor?.isActive('link')) {
			this.editor?.chain().focus().unsetLink().run()
		} else {
			let url = window.prompt('URL')
			if (!url?.startsWith('http')) {
				url = `https://${url}`
			}
			this.editor?.chain().focus().setLink({ href: url }).run()
		}
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				${when(this.label, () => html`<label for="textarea" part="label">${this.label}</label>`)}
				<div class="editor-wrapper" part="editor-wrapper">
					<div class="toolbar" part="toolbar">
					  <button @click=${() => this.toggleBold()}>Bold</button>
						<button @click=${() => this.toggleLink()}>Link</button>
						<button @click=${() => this.undo()} ?disabled=${!this.editor?.can().undo()}>Undo</button>
						<button @click=${() => this.redo()} ?disabled=${!this.editor?.can().redo()}>Redo</button>
						<button @click=${() => this.clearSelection()}>Clear Selected</button>
						<button @click=${() => this.clearAll()}>Clear All</button>
					</div>
					<div id="editor" class="editor" part="editor"></div>
					<textarea
						id="textarea"
						?disabled=${this.disabled}
						hidden
						?required=${this.required}
						name=${ifDefined(this.name)}
						.value=${live(this.value)}
					>
					</textarea>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-rich-text-editor': AppRichTextEditor
	}
}

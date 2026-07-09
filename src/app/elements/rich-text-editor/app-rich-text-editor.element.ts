import { appRichTextEditorStyle } from '@app/elements/rich-text-editor/app-rich-text-editor.style';
import { AppRichTextEditorChangeEvent } from '@app/events/rich-text-editor.event';
import { FormElement } from '@app/mixins/form.mixin';
import { defaultStyle } from '@app/styles/default.style';
import { Editor } from '@tiptap/core';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { css, html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { when } from 'lit/directives/when.js';

@customElement('app-rich-text-editor')
export class AppRichTextEditor extends FormElement {
	static styles = [defaultStyle, appRichTextEditorStyle, css``];

	@property({ type: Boolean })
	accessor disabled = false;

	@property({ type: String })
	accessor placeholder = '';

	@property({ type: String })
	accessor label = '';

	@property({ type: String })
	accessor toolbar = 'header text list link color clear';

	@property({ type: Boolean })
	accessor required = false;

	@query('textarea')
	accessor textarea!: HTMLTextAreaElement;

	editor: Editor | null = null;
	isInternalChange = false;

	protected firstUpdated() {
		this.editor = new Editor({
			element: this.renderRoot.querySelector('#editor'),
			extensions: [StarterKit, Placeholder.configure({ placeholder: this.placeholder }), TextStyle, Color],
			onUpdate: () => {
				this.isInternalChange = true;
				const html = this.editor?.getHTML() ?? '';
				const text = this.editor?.getText() ?? '';
				this.value = html;
				this.dispatchEvent(new AppRichTextEditorChangeEvent({ html, text }));
			},
			onSelectionUpdate: () => {
				if (this.toolbar.includes('color')) {
					this.updateColorToggle();
				}
				if (this.toolbar.includes('header')) {
					this.updateHeadingToggle();
				}
			},
		});
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.editor?.destroy();
	}

	protected updated(_changedProperties: PropertyValues) {
		if (_changedProperties.has('value') && !this.isInternalChange) {
			this.editor?.commands.setContent(this.value, { emitUpdate: false });
		}
		if (_changedProperties.has('disabled')) {
			this.editor?.setOptions({ editable: !this.disabled });
		}
	}

	getValidity() {
		return { flags: this.textarea.validity, message: this.textarea.validationMessage, anchor: this.textarea };
	}

	clearAll() {
		this.editor?.commands.clearContent(true);
	}

	clearSelection() {
		this.editor?.chain().focus().unsetAllMarks().run();
	}

	focus() {
		this.editor?.commands.focus();
	}

	blur() {
		this.editor?.commands.blur();
	}

	toggleBold() {
		this.editor?.chain().toggleBold().focus().run();
	}

	toggleItalic() {
		this.editor?.chain().toggleItalic().focus().run();
	}

	toggleUnderline() {
		this.editor?.chain().toggleUnderline().focus().run();
	}

	toggleStrike() {
		this.editor?.chain().toggleStrike().focus().run();
	}

	toggleHeadingLevel(level: 1 | 2 | 3 | 4 | 5 | 6) {
		this.editor?.chain().toggleHeading({ level }).focus().run();
	}

	toggleBulletList() {
		this.editor?.chain().toggleBulletList().focus().run();
	}

	toggleOrderedList() {
		this.editor?.chain().toggleOrderedList().focus().run();
	}

	setHorizontalRule() {
		this.editor?.chain().setHorizontalRule().focus().run();
	}

	toggleBlockquote() {
		this.editor?.chain().toggleBlockquote().focus().run();
	}

	undo() {
		this.editor?.chain().focus().undo().run();
	}

	redo() {
		this.editor?.chain().focus().redo().run();
	}

	toggleLink() {
		if (this.editor?.isActive('link')) {
			this.editor?.chain().focus().unsetLink().run();
		} else {
			let url = window.prompt('URL');
			if (!url?.startsWith('http')) {
				url = `https://${url}`;
			}
			this.editor?.chain().focus().setLink({ href: url }).run();
		}
	}

	setColor(event: Event) {
		const input = event.target as HTMLInputElement;
		this.editor?.chain().focus().setColor(input.value).run();
	}

	setHeading(event: Event) {
		const select = event.target as HTMLSelectElement;
		if (select.value === '0') {
			this.editor?.chain().focus().setParagraph().run();
		} else {
			const value = Number(select.value) as 1 | 2 | 3 | 4 | 5 | 6;
			this.toggleHeadingLevel(value);
		}
	}

	updateColorToggle() {
		const color = this.editor?.getAttributes('textStyle').color;
		const colorInput = this.renderRoot.querySelector<HTMLInputElement>('input[type="color"]');
		if (color && colorInput) {
			colorInput.value = color;
		}
	}

	updateHeadingToggle() {
		const options = this.renderRoot.querySelectorAll<HTMLOptionElement>('select option');
		const level = String(this.editor?.getAttributes('heading').level || '0');
		options.forEach((option) => {
			option.selected = option.value === level;
		});
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				${when(this.label, () => html`<label for="textarea" part="label">${this.label}</label>`)}
				<div class="editor-wrapper" part="editor-wrapper">
					<div class="toolbar" part="toolbar">
					  <select @change=${this.setHeading}>
							<option value="0">Normal</option>
							<option value="1">Heading 1</option>
							<option value="2">Heading 2</option>
							<option value="3">Heading 3</option>
							<option value="4">Heading 4</option>
							<option value="5">Heading 5</option>
							<option value="6">Heading 6</option>
						</select>
					  <button @click=${() => this.toggleBold()}>Bold</button>
						<button @click=${() => this.toggleItalic()}>Italic</button>
						<button @click=${() => this.toggleUnderline()}>Underline</button>
						<button @click=${() => this.toggleBulletList()}>Bullet List</button>
						<button @click=${() => this.toggleOrderedList()}>Ordered List</button>
						<button @click=${() => this.toggleLink()}>Link</button>
						<input type="color" @change=${this.setColor}/>
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
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-rich-text-editor': AppRichTextEditor;
	}
}

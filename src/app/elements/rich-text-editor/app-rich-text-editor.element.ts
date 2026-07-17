import { appRichTextEditorStyle } from '@app/elements/rich-text-editor/app-rich-text-editor.style';
import { AppRichTextEditorChangeEvent } from '@app/events/rich-text-editor.event';
import { FormElement } from '@app/mixins/form.mixin';
import { defaultStyle } from '@app/styles/default.style';
import { Editor } from '@tiptap/core';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { css, html, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { when } from 'lit/directives/when.js';
import '@app/elements/icon/app-icon.element';
import '@app/elements/button/app-button.element';

@customElement('app-rich-text-editor')
export class AppRichTextEditor extends FormElement {
	static styles = [
		defaultStyle,
		appRichTextEditorStyle,
		css`
        .custom-link {
          anchor-name: --anchor;
        }

        .link-popup {
          position-anchor: --anchor;
          width: fit-content;
          min-width: anchor-size(--anchor);
          position-try: flip-block;
          position-area: span-right;
          left: anchor(left);
          top: anchor(bottom);
      		border: 1px solid var(--theme-default-color);
          background: var(--theme-default-surface);
          border-radius: var(--radius-2);
          overflow: auto;
          padding: 5px;
          margin: 0;
          white-space: nowrap;
          box-shadow: var(--shadow-4);

          &:popover-open {
    				display: flex;
            align-items: center;
          }

          app-icon {
            font-size: 20px;
          }

          input {
            border: none;
            padding: 10px;
            margin-left: 5px;
            height: 30px;
            border-radius: var(--radius-2);
          }
        }
    `,
	];

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

	@query('.link-popup')
	accessor linkPopup!: HTMLDivElement;

	@state()
	private accessor selectedLink = '';

	editor: Editor | null = null;
	isInternalChange = false;

	protected firstUpdated() {
		this.editor = new Editor({
			element: this.renderRoot.querySelector('#editor'),
			extensions: [
				StarterKit.configure({
					link: {
						openOnClick: false,
						HTMLAttributes: {
							class: 'custom-link',
						},
					},
				}),
				Placeholder.configure({ placeholder: this.placeholder }),
				TextStyle,
				Color,
			],
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
				this.requestUpdate();
			},
			editorProps: {
				handleClick: (_view, _pos, event) => {
					const target = event.target;
					if (target instanceof HTMLAnchorElement) {
						this.selectedLink = target.href;
						this.linkPopup.showPopover();
					}
				},
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
		if (this.editor?.state.selection.empty && !this.editor?.isActive('link')) {
			return;
		}
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

	saveLink() {
		this.selectedLink = this.linkPopup.querySelector<HTMLInputElement>('input')?.value || this.selectedLink;
		this.editor?.chain().focus().extendMarkRange('link').updateAttributes('link', { href: this.selectedLink }).run();
		this.linkPopup.hidePopover();
	}

	deleteLink() {
		this.editor?.chain().focus().unsetLink().run();
		this.linkPopup.hidePopover();
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
				  <button @click=${() => this.toggleBold()} class=${classMap({ active: !!this.editor?.isActive('bold') })}>
            <app-icon>format_bold</app-icon>
          </button>
          <button @click=${() => this.toggleItalic()} class=${classMap({ active: !!this.editor?.isActive('italic') })}>
            <app-icon>format_italic</app-icon>
          </button>
          <button @click=${() => this.toggleUnderline()} class=${classMap({ active: !!this.editor?.isActive('underline') })}>
            <app-icon>format_underlined</app-icon>
          </button>
          <span class="separator"></span>
          <button @click=${() => this.toggleOrderedList()} class=${classMap({ active: !!this.editor?.isActive('orderedList') })}>
            <app-icon>format_list_numbered</app-icon>
          </button>
          <button @click=${() => this.toggleBulletList()} class=${classMap({ active: !!this.editor?.isActive('bulletList') })}>
            <app-icon>format_list_bulleted</app-icon>
          </button>
          <span class="separator"></span>
          <button @click=${() => this.toggleLink()} class=${classMap({ active: !!this.editor?.isActive('link') })}><app-icon>link</app-icon></button>
          <span class="separator"></span>
          <input type="color" @change=${this.setColor} />
          <span class="separator"></span>
          <button @click=${() => this.undo()} ?disabled=${!this.editor?.can().undo()}><app-icon>undo</app-icon></button>
          <button @click=${() => this.redo()} ?disabled=${!this.editor?.can().redo()}><app-icon>redo</app-icon></button>
          <span class="separator"></span>
          <button @click=${() => this.clearSelection()}><app-icon>format_clear</app-icon></button>
          <button @click=${() => this.clearAll()}><app-icon>delete_forever</app-icon></button>
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

			<div popover class="link-popup">
			  <input type="url" .value=${this.selectedLink || ''}/>
				<app-button href=${this.selectedLink || '#'} target="_blank" title="Preview" appearance="plain">
				  <app-icon>open_in_new</app-icon>
				</app-button>
				<app-button @click=${this.saveLink} title="Save" appearance="plain">
				  <app-icon>save</app-icon>
				</app-button>
				<app-button @click=${this.deleteLink} title="Delete" appearance="plain" variant="error">
				  <app-icon>delete</app-icon>
				</app-button>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-rich-text-editor': AppRichTextEditor;
	}
}

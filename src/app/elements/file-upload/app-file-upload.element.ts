import { appFileUploadStyle } from '@app/elements/file-upload/app-file-upload.style';
import { AppFileUploadErrorEvent, AppFileUploadEvent } from '@app/events/file-upload.event';
import { FormElement } from '@app/mixins/form.mixin';
import { defaultStyle } from '@app/styles/default.style';
import { css, html } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { when } from 'lit/directives/when.js';

@customElement('app-file-upload')
export class AppFileUpload extends FormElement {
	static styles = [defaultStyle, appFileUploadStyle, css``];

	@property({ type: Boolean })
	accessor required = false;

	@property({ type: String })
	accessor accept = '';

	@property({ type: String })
	accessor label = '';

	@property({ attribute: false })
	accessor files: FileList | null = null;

	@property({ type: Array })
	accessor filesList: Array<{ file?: File; name: string; url: string }> = [];

	@property({ type: String })
	accessor placeholder = '';

	@property({ type: Boolean })
	accessor multiple = false;

	@property({ type: Number })
	accessor size: number | undefined;

	@query('input')
	accessor input!: HTMLInputElement;

	@queryAssignedElements({ slot: 'trigger' })
	accessor triggers!: HTMLElement[];

	protected firstUpdated() {
		this.triggers.forEach((trigger) => {
			trigger.addEventListener('click', () => {
				if (!this.disabled) {
					this.input.click();
				}
			});
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.filesList.forEach((file) => {
			URL.revokeObjectURL(file.url);
		});
	}

	onChange() {
		this.touched = true;
		this.files = this.input.files;
		this.value = this.input.value;
		const validity = this.checkFilesValidity();
		if (validity && this.files) {
			this.filesList = Array.from(this.files).map((file) => ({ file, name: file.name, url: URL.createObjectURL(file) }));
			this.dispatchEvent(new AppFileUploadEvent(this.files));
		}
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
		this.dispatchEvent(new Event('change', { bubbles: true }));
	}

	formResetCallback() {
		super.formResetCallback();
		this.files = null;
		this.filesList = [];
		this.input.setCustomValidity('');
	}

	focus(options?: FocusOptions) {
		this.input.focus(options);
	}

	getValidity() {
		return { flags: this.input.validity, message: this.input.validationMessage, anchor: this.input };
	}

	checkFilesValidity() {
		if (!this.files) {
			return;
		}
		this.input.setCustomValidity('');
		for (const file of this.files) {
			const fileSizeInMB = file.size / 1024 ** 2;
			if (this.size && fileSizeInMB > this.size) {
				this.setCustomError(`File size too large. Maximum allowed is ${this.size} MB.`);
				return false;
			}
		}
		return true;
	}

	setCustomError(error: string) {
		this.input.setCustomValidity(error);
		this.dispatchEvent(new AppFileUploadErrorEvent(this.input.validationMessage));
		this.value = '';
	}

	deleteFile(index: number) {
		const [deleted] = this.filesList.splice(index, 1);
		URL.revokeObjectURL(deleted.url);
		if (this.filesList.length === 0) {
			this.value = '';
			this.input.setCustomValidity('');
		}
		this.requestUpdate();
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				${when(this.label, () => html`<label for="input" part="label">${this.label}</label>`)}
				<div class="file-upload-wrapper" part="file-upload-wrapper">
					<slot name="trigger"></slot>
					<input
						id="input"
						hidden
						?disabled=${this.disabled}
						?required=${this.required}
						?multiple=${this.multiple}
						name=${ifDefined(this.name)}
						@change=${this.onChange}
						.value=${live(this.value)}
						accept=${ifDefined(this.accept)}
						type="file"
					/>
					${when(
						this.filesList.length > 0,
						() => html`
						<ul>
							${this.filesList.map(
								(file, index) => html`
    				    <li>
    				      <a download=${file.name} href=${file.url}>${file.name}</a>
    				      <button @click=${() => this.deleteFile(index)} title="Remove file">✖</button>
    				    </li>
							`,
							)}
						</ul>
						`,
						() => html`<slot></slot>`,
					)}
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-file-upload': AppFileUpload;
	}
}

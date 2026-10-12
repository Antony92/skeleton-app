import { appFileUploadStyle } from '@app/elements/file-upload/app-file-upload.style';
import { AppFileUploadErrorEvent, AppFileUploadEvent } from '@app/events/file-upload.event';
import { FormElement } from '@app/mixins/form.mixin';
import { defaultStyle } from '@app/styles/default.style';
import { formatBytes } from '@app/utils/html';
import { css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
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
	accessor filesList: Array<{ name: string; size: number; type: string; url?: string }> = [];

	@property({ type: String })
	accessor placeholder = '';

	@property({ type: Boolean })
	accessor multiple = false;

	@property({ type: Number })
	accessor size: number | undefined;

	@query('input')
	accessor input!: HTMLInputElement;

	extensionMap: Record<string, string> = {
		// Images
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/gif': 'gif',
		'image/webp': 'webp',
		'image/svg+xml': 'svg',
		'image/bmp': 'bmp',
		'image/tiff': 'tiff',
		'image/x-icon': 'ico',

		// Documents & Spreadsheets
		'application/pdf': 'pdf',
		'application/msword': 'doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
		'application/vnd.ms-excel': 'xls',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
		'application/vnd.ms-powerpoint': 'ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
		'application/rtf': 'rtf',
		'text/csv': 'csv',

		// Text & Data
		'text/plain': 'txt',
		'application/json': 'json',
		'text/html': 'html',
		'application/xml': 'xml',
		'text/xml': 'xml',

		// Archives
		'application/zip': 'zip',
		'application/x-tar': 'tar',
		'application/x-rar-compressed': 'rar',
	};

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (!this.disabled && (target.assignedSlot?.name === 'trigger' || target.closest('[slot="trigger"]'))) {
				event.stopPropagation();
				this.input.click();
			}
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.cleanFilesURL();
	}

	onChange() {
		this.input.setCustomValidity('');
		this.touched = true;
		this.files = this.input.files;
		this.value = this.input.value;
		this.setFilesList();
		const validity = this.reportFilesValidity();
		if (validity && this.files) {
			this.dispatchEvent(new AppFileUploadEvent(this.files));
		}
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
		this.dispatchEvent(new Event('change', { bubbles: true }));
	}

	formResetCallback() {
		super.formResetCallback();
		this.files = null;
		this.filesList = [];
	}

	focus(options?: FocusOptions) {
		this.input.focus(options);
	}

	getValidity() {
		return { flags: this.input.validity, message: this.input.validationMessage, anchor: this.input };
	}

	reportFilesValidity() {
		if (!this.files) {
			return;
		}
		for (const file of this.files) {
			const fileSizeInMB = file.size / 1024 ** 2;
			if (this.size && fileSizeInMB > this.size) {
				this.setCustomError(`File ${file.name} too large. Maximum allowed is ${this.size} MB.`);
				return false;
			}
		}
		return true;
	}

	setFilesList() {
		if (!this.files) return;
		const previews = Array.from(this.files).map((file) => ({
			name: file.name,
			size: file.size,
			type: file.type,
			url: URL.createObjectURL(file),
		}));
		if (this.multiple) {
			this.filesList.push(...previews);
		} else {
			this.cleanFilesURL();
			this.filesList = previews;
		}
	}

	setCustomError(error: string) {
		this.setCustomValidity(error);
		this.dispatchEvent(new AppFileUploadErrorEvent(this.input.validationMessage));
		this.value = '';
	}

	deleteFile(index: number) {
		const [deleted] = this.filesList.splice(index, 1);
		if (deleted.url) URL.revokeObjectURL(deleted.url);
		if (this.filesList.length === 0) {
			this.value = '';
			this.setCustomValidity('');
		}
		this.requestUpdate();
	}

	cleanFilesURL() {
		this.filesList.forEach((file) => {
			if (file.url) URL.revokeObjectURL(file.url);
		});
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
					<slot></slot>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}>${this.message}</small>
			</div>
			${when(
				this.filesList.length > 0,
				() => html`
				<ul>
					${this.filesList.map(
						(file, index) => html`
				      <li>
								<span class="preview">
									${when(
										file.url && file.type.startsWith('image/'),
										() => html`<img src=${file.url} alt=${file.name} />`,
										() => html`.${this.extensionMap[file.type] ?? file.type}`,
									)}
								</span>
								<span class="details">
								  <a download=${file.name} href=${file.url}>${file.name}</a>
									<small>${formatBytes(file.size)}</small>
								</span>
  				      <button @click=${() => this.deleteFile(index)} title="Remove file">✕</button>
				      </li>
					`,
					)}
				</ul>
				`,
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-file-upload': AppFileUpload;
	}
}

import { globalMessage } from '@app/shared/global-message';
import { css, html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '@app/elements/dialog/app-dialog.element';
import '@app/elements/button/app-button.element';
import '@app/elements/icon/app-icon.element';
import '@app/elements/paginator/app-paginator.element';
import '@app/elements/input/app-input.element';
import '@app/elements/badge/app-badge.element';
import '@app/elements/checkbox/app-checkbox.element';
import '@app/elements/rich-text-editor/app-rich-text-editor.element';
import '@app/elements/radio/app-radio.element';
import '@app/elements/radio-group/app-radio-group.element';
import '@app/elements/textarea/app-textarea.element';
import '@app/elements/dropdown/app-dropdown.element';
import '@app/elements/dropdown-item/app-dropdown-item.element';
import '@app/elements/select/app-select.element';
import '@app/elements/select-option/app-select-option.element';
import '@app/elements/autocomplete/app-autocomplete.element';
import '@app/elements/tab/app-tab.element';
import '@app/elements/tab-group/app-tab-group.element';
import '@app/elements/tab-panel/app-tab-panel.element';
import '@app/elements/tooltip/app-tooltip.element';
import '@app/elements/file-upload/app-file-upload.element';
import '@app/elements/tag-group/app-tag-group.element';
import '@app/elements/tag/app-tag.element';
import '@app/elements/tooltip/app-tooltip.element';
import '@app/elements/popup/app-popup.element';
import type { AppAutocomplete } from '@app/elements/autocomplete/app-autocomplete.element';
import type { AppDialog } from '@app/elements/dialog/app-dialog.element';
import { getProducts } from '@app/services/api.service';
import { confirmDialog, promptDialog } from '@app/shared/dialogs';
import { loading } from '@app/shared/loader';
import { notify } from '@app/shared/notification';
import { setPageTitle } from '@app/utils/html';

@customElement('app-demo-page')
export class AppDemoPage extends LitElement {
	static styles = [
		css`
			:host {
				display: flex;
				flex-direction: column;
				gap: 20px;
			}

			.demo {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        border-radius: var(--radius-2);
        border: 1px solid var(--theme-muted-color);
        padding: 10px;

				.container {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 10px;
					width: 100%;

					app-input, app-autocomplete, app-textarea, app-select {
						width: 100%;

						@media (min-width: 768px) {
							max-width: 350px;
						}
					}
				}
			}

			h3, h4 {
				margin: 0 0 10px 0;
			}
		`,
	];

	@query('app-dialog')
	appDialog!: AppDialog;

	connectedCallback() {
		super.connectedCallback();
		setPageTitle('Demo');
	}

	protected async firstUpdated() {}

	render() {
		return html`
			<h3>Demo</h3>
			<div class="demo">
				<h4>Buttons</h4>
				<div class="container">
					<app-button variant="default">Default</app-button>
					<app-button variant="primary">Primary</app-button>
					<app-button variant="success">Success</app-button>
					<app-button variant="warning">Warning</app-button>
					<app-button variant="error">Error</app-button>
					<app-button variant="primary" appearance="outlined">Outlined</app-button>
					<app-button variant="primary" disabled>Disabled</app-button>
					<app-button variant="primary" loading>Loading</app-button>
					<app-button variant="primary">
						<app-icon filled>skull</app-icon>
						Left icon
					</app-button>
					<app-button variant="primary">
						Right icon
						<app-icon filled>skull</app-icon>
					</app-button>
					<app-button variant="primary" appearance="plain">
						<app-icon filled>skull</app-icon>
					</app-button>
					<app-button variant="primary" appearance="plain" href="#" target="_blank">Link</app-button>
				</div>
			</div>

			<div class="demo">
				<h4>Input</h4>
				<div class="container">
					<app-input label="Input label" placeholder="Type something"></app-input>
					<app-input label="With prefix and suffix" placeholder="Type something">
						<app-icon slot="prefix" filled>search</app-icon>
						<app-icon slot="suffix" filled>attach_money</app-icon>
					</app-input>
					<app-input label="Clearable" placeholder="Type something" clearable></app-input>
				</div>
			</div>

			<div class="demo">
				<h4>Textarea</h4>
				<div class="container">
					<app-textarea label="Textarea" placeholder="Type something"></app-textarea>
				</div>
			</div>

			<div class="demo">
				<h4>Checkbox</h4>
				<div class="container">
					<app-checkbox label="Check me!"></app-checkbox>
				</div>
			</div>

			<div class="demo">
				<h4>Radio Group</h4>
				<div class="container">
					<app-radio-group label="Select one radio" value="1">
						<app-radio label="Radio 1" value="1"></app-radio>
						<app-radio label="Radio 2" value="2"></app-radio>
					</app-radio-group>
				</div>
			</div>

			<div class="demo">
				<h4>Select</h4>

				<div class="container">
					<app-select label="Select single" placeholder="Select">
						<app-select-option value="option-1">Option 1</app-select-option>
						<app-select-option value="option-2">Option 2</app-select-option>
						<app-select-option value="option-3">Option 3</app-select-option>
						<app-select-option value="option-4">Option 4</app-select-option>
						<app-select-option value="option-5">Option 5</app-select-option>
					</app-select>

					<app-select label="Select multiple" multiple placeholder="Select multiple">
						<app-select-option value="option-1">Option 1</app-select-option>
						<app-select-option value="option-2">Option 2</app-select-option>
						<app-select-option value="option-3">Option 3</app-select-option>
						<app-select-option value="option-4">Option 4</app-select-option>
						<app-select-option value="option-5">Option 5</app-select-option>
					</app-select>

					<app-select label="Select with search" placeholder="Select" searchable>
						<app-select-option value="option-1">Option 1</app-select-option>
						<app-select-option value="option-2">Option 2</app-select-option>
						<app-select-option value="option-3">Option 3</app-select-option>
						<app-select-option value="option-4">Option 4</app-select-option>
						<app-select-option value="option-5">Option 5</app-select-option>
					</app-select>
				</div>
			</div>

			<div class="demo">
				<h4>Autocomplete</h4>
				<div class="container">
					<app-autocomplete
						placeholder="Search..."
						@app-search=${async (e: Event) => {
							const target = e.target as AppAutocomplete;
							const products = await getProducts(target.search);
							target.results = products.map((p: any) => ({ label: p.title, value: p.id }));
						}}>
						<app-icon slot="prefix" filled>search</app-icon>
					</app-autocomplete>
				</div>
			</div>

			<div class="demo">
				<h4>Dropdown</h4>
				<div class="container">
					<app-dropdown>
						<app-button slot="trigger" variant="primary">
							Dropdown
							<app-icon filled>arrow_drop_down</app-icon>
						</app-button>
						<app-dropdown-item value="1">
							<app-icon slot="prefix">save</app-icon>
							Save
						</app-dropdown-item>
						<app-dropdown-item disabled>
							<app-icon slot="prefix">delete</app-icon>
							Delete
						</app-dropdown-item>
					</app-dropdown>
				</div>
			</div>

			<div class="demo">
				<h4>Rich Text Editor</h4>
				<div class="container">
					<app-rich-text-editor placeholder="Rich text"></app-rich-text-editor>
				</div>
			</div>

			<div class="demo">
				<h4>Global messages</h4>
				<div class="container">
					<app-button variant="primary" @click=${() => globalMessage('This is info', 'info')}>Info</app-button>
					<app-button variant="warning" @click=${() => globalMessage('This is warning', 'warning')}>Warning</app-button>
					<app-button variant="error" @click=${() => globalMessage('This is error', 'error')}>Error</app-button>
				</div>
			</div>

			<div class="demo">
				<h4>Dialog</h4>
				<div class="container">
					<app-button variant="primary" @click=${() => this.appDialog.show()}>Open template dialog</app-button>
					<app-button
						variant="primary"
						@click=${() =>
							confirmDialog({
								header: 'Confirm dialog',
								message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
							})}
					>
						Open confirm dialog
					</app-button>
					<app-button
						variant="primary"
						@click=${() =>
							promptDialog({
								header: 'Confirm dialog',
								message: `Type 'skeleton' to confirm operation`,
								promt: 'skeleton',
							})}
					>
						Open confirm dialog with input
					</app-button>
				</div>
			</div>

			<div class="demo">
				<h4>Snackbar</h4>
				<div class="container">
					<app-button
						variant="primary"
						@click=${() =>
							notify({
								message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
								action: {
									label: 'Undo',
									onAction: (event) => console.log(event),
								},
							})}
					>
						Open snackbar
					</app-button>
				</div>
			</div>

			<div class="demo">
				<h4>Badge</h4>
				<div class="container">
					<app-badge variant="default">Default</app-badge>
					<app-badge variant="primary">Primary</app-badge>
					<app-badge variant="success">Success</app-badge>
					<app-badge variant="warning">Warning</app-badge>
					<app-badge variant="error" pulse>Error</app-badge>
				</div>
			</div>

			<div class="demo">
				<h4>Tag</h4>
				<div class="container">
					<app-tag-group>
						<app-tag active value="all">All</app-tag>
						<app-tag value="some">Only Some</app-tag>
					</app-tag-group>
				</div>
			</div>

			<div class="demo">
				<h4>Paginator</h4>
				<div class="container">
					<app-paginator total="100"></app-paginator>
				</div>
			</div>

			<div class="demo">
				<h4>Tabs</h4>
				<div class="container">
					<app-tab-group>
						<app-tab slot="tab" panel="general" active>General</app-tab>
						<app-tab slot="tab" panel="custom">Custom</app-tab>
						<app-tab slot="tab" panel="advanced">Advanced</app-tab>
						<app-tab slot="tab" panel="disabled" disabled>Disabled</app-tab>

						<app-tab-panel name="general">This is the general tab panel.</app-tab-panel>
						<app-tab-panel name="custom">This is the custom tab panel.</app-tab-panel>
						<app-tab-panel name="advanced">This is the advanced tab panel.</app-tab-panel>
						<app-tab-panel name="disabled">This is a disabled tab panel.</app-tab-panel>
					</app-tab-group>
				</div>
			</div>

			<div class="demo">
				<h4>Loading</h4>
				<div class="container">
					<app-button
						variant="primary"
						@click=${() => {
							loading(true);
							setTimeout(() => loading(false), 3000);
						}}
					>
						Long task
					</app-button>
				</div>
			</div>

			<div class="demo">
				<h4>File upload</h4>
				<div class="container">
					<app-file-upload size="1" label="Upload">
						<app-button variant="primary" slot="trigger">Upload</app-button>
						Upload files here
					</app-file-upload>
				</div>
			</div>

			<div class="demo">
				<h4>Tooltip</h4>
				<div class="container">
					<app-tooltip content="Button help text">
						<app-button variant="primary">Hover</app-button>
					</app-tooltip>
				</div>
			</div>

			<div class="demo">
				<h4>Popup</h4>
				<div class="container">
					<app-popup>
						<app-button slot="trigger" variant="primary">Open</app-button>
						<div>This is custom <strong>message</strong> that allows any <i>formatting</i></div>
						<app-button appearance="plain" variant="primary" app-popup-close>Close</app-button>
					</app-popup>
				</div>
			</div>

			<app-dialog header="Template dialog">
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is
				simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
				1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text
				of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
				unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text of the printing
				and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
				galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
				and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
				has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
				make a type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
				industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
				specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
				dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem
				Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply
				dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
				when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text of the
				printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
				printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text of the printing and
				typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
				galley of type and scrambled it to make a type specimen book.
				<app-button slot="footer" variant="primary" autofocus app-dialog-close>Close</app-button>
			</app-dialog>
		`;
	}
}

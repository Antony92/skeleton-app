import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { globalMessage } from '@app/shared/global-message'
import '@app/elements/dialog/app-dialog.element'
import '@app/elements/button/app-button.element'
import '@app/elements/icon/app-icon.element'
import '@app/elements/paginator/app-paginator.element'
import '@app/elements/input/app-input.element'
import '@app/elements/badge/app-badge.element'
import '@app/elements/checkbox/app-checkbox.element'
import '@app/elements/rich-text-editor/app-rich-text-editor.element'
import '@app/elements/radio/app-radio.element'
import '@app/elements/radio-group/app-radio-group.element'
import '@app/elements/textarea/app-textarea.element'
import '@app/elements/dropdown/app-dropdown.element'
import '@app/elements/dropdown-item/app-dropdown-item.element'
import '@app/elements/select/app-select.element'
import '@app/elements/select-option/app-select-option.element'
import '@app/elements/tab/app-tab.element'
import '@app/elements/tab-group/app-tab-group.element'
import '@app/elements/tab-panel/app-tab-panel.element'
import { AppDialog } from '@app/elements/dialog/app-dialog.element'
import { confirmDialog, promptDialog } from '@app/shared/dialog'
import { notify } from '@app/shared/notification'
import { loading } from '@app/shared/loader'
import { setPageTitle } from '@app/utils/html'

@customElement('app-demo-page')
export class AppDemoPage extends LitElement {
	static styles = [
		css`
			:host {
				display: flex;
				flex-direction: column;
				gap: 20px;
			}

			fieldset {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 10px;
				border-radius: var(--radius-2);
			}
		`,
	]

	@query('app-dialog')
	appDialog!: AppDialog

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Demo')
	}

	protected async firstUpdated() {}

	render() {
		return html`
			Demo
			<fieldset>
				<legend>Buttons</legend>
				<app-button variant="default">Default</app-button>
				<app-button variant="primary">Primary</app-button>
				<app-button variant="success">Success</app-button>
				<app-button variant="warning">Warning</app-button>
				<app-button variant="error">Error</app-button>
				<app-button variant="primary" outlined>Outlined</app-button>
				<app-button variant="primary" disabled>Disabled</app-button>
				<app-button variant="primary">
					<app-icon filled>skull</app-icon>
					Right icon
				</app-button>
				<app-button variant="primary">
					Left icon
					<app-icon filled>skull</app-icon>
				</app-button>
				<app-button variant="primary" icon>
					<app-icon filled>skull</app-icon>
				</app-button>
				<app-button variant="primary" text>Only text</app-button>
			</fieldset>

			<fieldset>
				<legend>Input</legend>
				<app-input label="Input label" placeholder="Type something" @app-input=${(event: Event) => console.log(event.target)}></app-input>
				<app-input label="With prefix and suffix" placeholder="Type something">
					<app-icon slot="prefix" filled>search</app-icon>
					<app-icon slot="suffix" filled>clear</app-icon>
				</app-input>
			</fieldset>

			<fieldset>
				<legend>Textarea</legend>
				<app-textarea label="Textarea" placeholder="Type something"></app-textarea>
			</fieldset>

			<fieldset>
				<legend>Checkbox</legend>
				<app-checkbox label="Check me!"></app-checkbox>
			</fieldset>

			<fieldset>
				<legend>Radio Group</legend>
				<app-radio-group label="Select one radio" value="1">
					<app-radio label="Radio 1" value="1"></app-radio>
					<app-radio label="Radio 2" value="2"></app-radio>
				</app-radio-group>
			</fieldset>

			<fieldset>
				<legend>Select</legend>

				<app-select label="Select single">
					<app-select-option value="option-1">Option 1</app-select-option>
					<app-select-option value="option-2">Option 2</app-select-option>
					<app-select-option value="option-3">Option 3</app-select-option>
					<app-select-option value="option-4">Option 4</app-select-option>
					<app-select-option value="option-5">Option 5</app-select-option>
				</app-select>

				<app-select label="Select multiple" value="option-1" multiple>
					<app-select-option value="option-1">Option 1</app-select-option>
					<app-select-option value="option-2">Option 2</app-select-option>
					<app-select-option value="option-3">Option 3</app-select-option>
					<app-select-option value="option-4">Option 4</app-select-option>
					<app-select-option value="option-5">Option 5</app-select-option>
				</app-select>
			</fieldset>

			<fieldset>
				<legend>Dropdown</legend>
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
			</fieldset>

			<fieldset>
				<legend>Rich Text Editor</legend>
				<app-rich-text-editor></app-rich-text-editor>
			</fieldset>

			<fieldset>
				<legend>Global messages</legend>
				<app-button variant="primary" @click=${() => globalMessage('This is info', 'info')}>Info</app-button>
				<app-button variant="warning" @click=${() => globalMessage('This is warning', 'warning')}>Warning</app-button>
				<app-button variant="error" @click=${() => globalMessage('This is error', 'error')}>Error</app-button>
			</fieldset>

			<fieldset>
				<legend>Dialog</legend>
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
			</fieldset>

			<fieldset>
				<legend>Snackbar</legend>
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
			</fieldset>

			<fieldset>
				<legend>Badge</legend>
				<app-badge variant="primary" pulse>Default</app-badge>
			</fieldset>

			<fieldset>
				<legend>Paginator</legend>
				<app-paginator total="100"></app-paginator>
			</fieldset>

			<fieldset>
				<legend>Tabs</legend>
				<app-tab-group>
					<app-tab slot="tab" panel="general">General</app-tab>
					<app-tab slot="tab" panel="custom">Custom</app-tab>
					<app-tab slot="tab" panel="advanced">Advanced</app-tab>
					<app-tab slot="tab" panel="disabled" disabled>Disabled</app-tab>

					<app-tab-panel name="general">This is the general tab panel.</app-tab-panel>
					<app-tab-panel name="custom">This is the custom tab panel.</app-tab-panel>
					<app-tab-panel name="advanced">This is the advanced tab panel.</app-tab-panel>
					<app-tab-panel name="disabled">This is a disabled tab panel.</app-tab-panel>
				</app-tab-group>
			</fieldset>

			<fieldset>
				<legend>Loading</legend>
				<app-button
					variant="primary"
					@click=${() => {
						loading(true)
						setTimeout(() => loading(false), 3000)
					}}
				>
					Long task
				</app-button>
			</fieldset>

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
		`
	}
}

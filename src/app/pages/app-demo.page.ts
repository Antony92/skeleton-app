import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { globalMessage } from '@app/shared/global-message'
import '@app/elements/dialog/app-dialog.element'
import '@app/elements/button/app-button.element'
import '@app/elements/icon/app-icon.element'
import '@app/elements/paginator/app-paginator.element'
import '@app/elements/input/app-input.element'
import { AppDialog } from '@app/elements/dialog/app-dialog.element'
import { confirmDialog, confirmInputDialog } from '@app/shared/dialog'
import { notify } from '@app/shared/notification'
import { loading } from '@app/shared/loader'
import { setDocumentTitle } from '@app/utils/html'

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
		setDocumentTitle('Demo')
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
					<app-icon prefix="fas" name="skull"></app-icon>
					Right icon
				</app-button>
				<app-button variant="primary">
					Left icon
					<app-icon prefix="fas" name="skull"></app-icon>
				</app-button>
				<app-button variant="primary" icon>
					<app-icon prefix="fas" name="skull"></app-icon>
				</app-button>
				<app-button variant="primary" text>Only text</app-button>
			</fieldset>

			<fieldset>
				<legend>Input</legend>
				<app-input label="Input label" placeholder="Type something" @app-input=${(event: Event) => console.log(event.target)}></app-input>
				<app-input label="With prefix and suffix" placeholder="Type something">
					<app-icon slot="prefix" prefix="fas" name="skull"></app-icon>
					<app-icon slot="suffix" prefix="fas" name="skull"></app-icon>
				</app-input>
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
						confirmInputDialog({
							header: 'Confirm dialog',
							message: `Type 'skeleton' to confirm operation`,
							word: 'skeleton'
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
						})}
				>
					Open snackbar
				</app-button>
			</fieldset>

			<fieldset>
				<legend>Paginator</legend>
				<app-paginator total="100"></app-paginator>
			</fieldset>

			<fieldset>
				<legend>Loading</legend>
				<app-button
					variant="primary"
					@click=${() => {
						loading(true)
						setTimeout(() => loading(false), 3000)
					}}
					>Long task</app-button
				>
			</fieldset>

			<app-dialog header="Template dialog">
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				<app-button slot="footer" variant="primary" autofocus app-dialog-close>Close</app-button>
			</app-dialog>
		`
	}
}

import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { faMagnifyingGlassIcon, iconStyle } from '@app/styles/icon.style'
import { buttonStyle } from '@app/styles/button.style'
import { globalMessage } from '@app/shared/global-message'
import '@app/elements/dialog/app-dialog.element'
import { AppDialog } from '@app/elements/dialog/app-dialog.element'

@customElement('app-demo')
export class AppDemo extends LitElement {
	static styles = [
		buttonStyle,
		iconStyle,
		css`
            :host {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

			fieldset {
				display: flex;
                flex-wrap: wrap;
				gap: 10px;
				border-radius: var(--radius-2);
			}
		`,
	]

	@query('app-dialog')
	appDialog!: AppDialog

	protected firstUpdated() {}

	render() {
		return html`
			Demo
			<fieldset>
				<legend>Buttons</legend>
				<button class="primary">Primary</button>
				<button class="secondary">Secondary</button>
				<button class="success">Success</button>
				<button class="warning">Warning</button>
				<button class="error">Error</button>
				<button class="primary" disabled>Disabled</button>
				<button class="primary">
					<i class="icon">${faMagnifyingGlassIcon}</i>
					Right icon
				</button>
				<button class="primary">
					Left icon
					<i class="icon">${faMagnifyingGlassIcon}</i>
				</button>
				<button class="primary only-text">Only text</button>
				<button class="only-icon">
					<i class="icon">${faMagnifyingGlassIcon}</i>
				</button>
			</fieldset>

			<fieldset>
				<legend>Global messages</legend>
				<button class="primary" @click=${() => globalMessage('This is info', 'info')}>Info</button>
                <button class="warning" @click=${() => globalMessage('This is warning', 'warning')}>Warning</button>
                <button class="error" @click=${() => globalMessage('This is error', 'error')}>Error</button>
			</fieldset>

			<fieldset>
				<legend>Dialog</legend>
				<button class="primary" @click=${() => this.appDialog.show()}>Open dialog</button>
			</fieldset>



			<app-dialog header="Dialog title" light-dismiss>
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
				<button slot="footer" class="primary" autofocus app-dialog-close>Close</button>
			</app-dialog>
		`
	}
}

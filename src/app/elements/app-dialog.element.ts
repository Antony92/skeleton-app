import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('app-dialog')
export class AppDialog extends LitElement {
	static styles = css`
		dialog {
			padding: 0;
			border: 0;
		}

		dialog div:first-child {
			padding: 10px;
		}

		dialog::backdrop {
			background: rgba(0, 0, 0, 0.5);
		}
	`

	@query('#dialog')
	private dialog!: HTMLDialogElement | any

	@property({ type: String, attribute: 'dialog-title' })
	dialogTitle = 'Dialog'

	@property({ type: Boolean })
	modal = false

	protected firstUpdated() {
		if (!this.modal) {
			this.dialog.addEventListener('click', (e: Event) => {
				if (!this.modal && e.target === this.dialog) {
					this.close()
				}
			})
		}
		this.querySelectorAll('button[dialog-close]')?.forEach((element) => {
			element.addEventListener('click', () =>
				this.close({
					result: element.getAttribute('dialog-close'),
				})
			)
		})
	}

	public open() {
		this.dialog.showModal()
		this.dispatchEvent(new Event('dialog-open', { bubbles: true, composed: true }))
	}

	public close(detail?: unknown) {
		this.dialog.close()
		this.dispatchEvent(new CustomEvent('dialog-close', { bubbles: true, composed: true, detail }))
	}

	protected render() {
		return html`
			<dialog id="dialog">
				<div>
					<h3>${this.dialogTitle}</h3>
					<form id="form" method="dialog">
						<slot></slot>
					</form>
				</div>
			</dialog>
		`
	}
}

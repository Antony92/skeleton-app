import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'

@customElement('app-dialog')
export class AppDialog extends LitElement {
	static styles = css`
		html:has(dialog[open]) {
			overflow: hidden;
		}

		dialog {
			padding: 0;
			max-inline-size: min(90vw, 60ch);
			max-block-size: min(80vh, 100%);
			overflow: hidden;

			&::backdrop {
				backdrop-filter: blur(0.25rem);
				transition: backdrop-filter 0.5s ease;
			}

			&:not([open]) {
				pointer-events: none;
				opacity: 0;
			}

			article {
				overflow-y: auto;
				overscroll-behavior-y: contain;
				display: grid;
				justify-items: flex-start;
				max-block-size: 100%;
			}

			div {
				display: grid;
				grid-template-rows: auto 1fr auto;
				align-items: start;
				max-block-size: 80vh;
			}
		}
	`

	@property({ type: String })
	title = ''

	@property({ type: Boolean, attribute: 'light-dismiss' })
	lightDismiss = false

	@query('dialog')
	dialog!: HTMLDialogElement

	@queryAssignedElements({ slot: 'footer', selector: '[app-dialog-close]' })
	closeElements!: Array<HTMLElement>

	private static DEFAULT_CLOSE = 'default-close'

	private _returnValue = ''

	async show() {
		this.dialog.showModal()
		this.dispatchEvent(new Event('app-show'))
		await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide(returnValue?: string | null) {
		this.dialog.close(returnValue || AppDialog.DEFAULT_CLOSE)
		this._returnValue = returnValue ? this.dialog.returnValue : ''
		this.dispatchEvent(new Event('app-hide'))
		await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
		this.dispatchEvent(new Event('app-after-hide'))
	}

	protected firstUpdated() {
		this.dialog.addEventListener('click', ({ target: element }) => {
			if (element instanceof HTMLDialogElement && this.lightDismiss) {
				this.hide()
			}
		})

		this.dialog.addEventListener('close', async () => {
			if (this.dialog.returnValue) {
				return
			}
			this.dispatchEvent(new Event('app-hide'))
			await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
			this.dispatchEvent(new Event('app-after-hide'))
		})

		this.closeElements.forEach((element) => element.addEventListener('click', () => this.hide(element.getAttribute('app-dialog-close'))))
	}

	get returnValue() {
		return this._returnValue
	}

	render() {
		return html`
			<dialog>
				<div>
					<header>
						<h3>${this.title}</h3>
						<button @click=${this.hide}>X</button>
					</header>
					<article>
						<slot></slot>
					</article>
					<footer>
						<slot name="footer"></slot>
					</footer>
				</div>
			</dialog>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dialog': AppDialog
	}
}

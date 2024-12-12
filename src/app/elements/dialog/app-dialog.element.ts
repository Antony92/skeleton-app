import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { appDialogStyle } from './app-dialog.style'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-dialog')
export class AppDialog extends LitElement {
	static styles = [appDialogStyle, focusStyle, css`
		:host {
			display: none;
		}

		:host([open]) {
			display: block;
		}
	`]

	@property({ type: String })
	header = ''

	@property({ type: Boolean, reflect: true })
	open = false

	@property({ type: Boolean, attribute: 'light-dismiss' })
	lightDismiss = false

	@query('dialog')
	dialog!: HTMLDialogElement

	@queryAssignedElements({ slot: 'footer', selector: '[app-dialog-close]' })
	closeElements!: Array<HTMLElement>

	private static DEFAULT_CLOSE = 'default-close'

	protected firstUpdated() {
		this.dialog.addEventListener('click', ({ target: element }) => {
			if (element instanceof HTMLDialogElement && this.lightDismiss) {
				this.hide()
			}
		})

		this.dialog.addEventListener('close', async () => {
			await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
			this.open = false
			this.dispatchEvent(new Event('app-after-hide'))
		})

		this.closeElements.forEach((element) => element.addEventListener('click', () => this.hide(element.getAttribute('app-dialog-close'))))
	}

	async show() {
		await this.updateComplete
		this.open = true
		this.dialog.showModal()
	}

	async hide(returnValue?: string | null) {
		await this.updateComplete
		this.dialog.close(returnValue || AppDialog.DEFAULT_CLOSE)
	}

	get returnValue() {
		return this.dialog.returnValue
	}

	render() {
		return html`
			<dialog>
				<div class="container">
					<header>
						<h3>${this.header}</h3>
						<button class="focus-visible" @click=${this.hide}>✕</button>
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

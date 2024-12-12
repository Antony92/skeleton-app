import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { appDialogStyle } from './app-dialog.style'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-dialog')
export class AppDialog extends LitElement {
	static styles = [appDialogStyle, focusStyle,  css``]

	@property({ type: String })
	header = ''

	@property({ type: Boolean, attribute: 'light-dismiss' })
	lightDismiss = false

	@query('dialog')
	dialog!: HTMLDialogElement

	@queryAssignedElements({ slot: 'footer', selector: '[app-dialog-close]' })
	closeElements!: Array<HTMLElement>

	private static DEFAULT_CLOSE = 'default-close'

	private _returnValue = ''

	get returnValue() {
		return this._returnValue
	}

	async show() {
		await this.updateComplete
		this.dialog.showModal()
		this.dialog.animate([{ opacity: 0 }, { opacity: 1 }], { fill: 'both', duration: 100 })
		await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
	}

	async hide(returnValue?: string | null) {
		await this.updateComplete
		this._returnValue = returnValue ? this.dialog.returnValue : ''
		this.dialog.animate([{ opacity: 1 }, { opacity: 0 }], { fill: 'both', duration: 100 })
		await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
		this.dialog.close(returnValue || AppDialog.DEFAULT_CLOSE)
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
			await Promise.allSettled(this.dialog.getAnimations().map((a) => a.finished))
			this.dispatchEvent(new Event('app-after-hide'))
		})

		this.closeElements.forEach((element) => element.addEventListener('click', () => this.hide(element.getAttribute('app-dialog-close'))))
	}

	render() {
		return html`
			<dialog>
				<div>
					<header>
						<h3>${this.header}</h3>
						<button class="focus-within" @click=${this.hide}>✕</button>
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

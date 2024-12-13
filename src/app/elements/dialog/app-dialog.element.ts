import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { appDialogStyle } from './app-dialog.style'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-dialog')
export class AppDialog extends LitElement {
	static styles = [appDialogStyle, focusStyle, css``]

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

		// add this when toggle is supported for dialogs instead of 'close'

		// this.dialog.addEventListener('toggle', async (event) => {
		// 	const state = (event as ToggleEvent).newState
		// 	await Promise.allSettled(this.dialog.getAnimations().map(a => a.finished))
		// 	if (state === 'open') {
		//		this.open = true
		// 		this.dispatchEvent(new Event('app-after-open'))
		// 	}
		// 	if (state === 'closed') {
		//		this.open = false
		// 		this.dispatchEvent(new Event('app-after-hide'))
		// 	}
		// })

		this.dialog.addEventListener('close', async () => {
			this.open = false
			this.dispatchEvent(new Event('app-after-hide'))
		})

		this.closeElements.forEach((element) => element.addEventListener('click', () => this.hide(element.getAttribute('app-dialog-close'))))
	}

	async show() {
		this.open = true
		await this.updateComplete
		this.dialog.showModal()
		await this.animation()
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide(returnValue?: string | null) {
		await this.updateComplete
		await this.animation(true)
		this.dialog.close(returnValue || AppDialog.DEFAULT_CLOSE)
	}

	async animation(reverse = false) {
		const animation = this.dialog.animate(
			[
				{ scale: 0, opacity: 0 },
				{ scale: 1, opacity: 1 },
			],
			{
				direction: reverse ? 'reverse' : 'normal',
				duration: 200,
				fill: 'both',
			}
		)
		return animation.finished
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

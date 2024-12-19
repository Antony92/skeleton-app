import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { appDialogStyle } from './app-dialog.style'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-dialog')
export class AppDialog extends LitElement {
	static styles = [
		appDialogStyle,
		focusStyle,
		css`
			:host {
				display: none;
			}

			:host([open]) {
				display: block;
			}
		`,
	]

	@property({ type: String })
	accessor header = ''

	@property({ type: Boolean, reflect: true })
	accessor open = false

	@property({ type: Boolean })
	accessor modal = false

	@query('dialog')
	accessor dialog!: HTMLDialogElement

	@queryAssignedElements({ slot: 'footer', selector: '[app-dialog-close]' })
	accessor closeElements!: Array<HTMLElement>

	protected firstUpdated() {
		this.dialog.addEventListener('click', ({ target: element }) => {
			if (element instanceof HTMLDialogElement === false) {
				return
			}
			if (this.modal) {
				this.pulseAnimation()
			} else {
				this.hide()
			}
		})

		this.dialog.addEventListener('cancel', (event) => {
			event.preventDefault()
			this.hide()
		})

		this.closeElements.forEach((element) =>
			element.addEventListener('click', () => {
				const value = element.getAttribute('app-dialog-close') || ''
				this.hide(value)
			})
		)
	}

	async show() {
		if (!this.dispatchEvent(new Event('app-show', { cancelable: true }))) {
			return
		}
		this.open = true
		await this.updateComplete
		this.dialog.showModal()
		await this.openAnimation()
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide(value?: string) {
		if (!this.dispatchEvent(new Event('app-hide', { cancelable: true }))) {
			return
		}
		await this.updateComplete
		await this.openAnimation(true)
		this.dialog.close(value)
		this.open = false
		this.dispatchEvent(new Event('app-after-hide'))
	}

	openAnimation(reverse = false) {
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

	pulseAnimation() {
		const animation = this.dialog.animate([{ scale: 1 }, { scale: 1.02 }, { scale: 1 }], {
			duration: 250,
			fill: 'both',
		})
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

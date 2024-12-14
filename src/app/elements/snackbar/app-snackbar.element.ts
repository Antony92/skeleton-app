import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { appSnackbarStyle } from './app-snackbar.style'
import { classMap } from 'lit/directives/class-map.js'

@customElement('app-snackbar')
export class AppSnackbar extends LitElement {
	static styles = [
		appSnackbarStyle,
		css`
			:host {
				display: none;
			}

			:host([open]) {
				display: block;
			}
		`,
	]

	@query('.snackbar')
	snackbar!: HTMLDivElement

	@queryAssignedElements({ slot: 'action', selector: '[app-snackbar-close]' })
	closeElements!: Array<HTMLElement>

	@property({ type: String, reflect: true })
	variant: 'default' | 'primary' | 'success' | 'error' | 'warning' = 'default'

	@property({ type: String, reflect: true })
	position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left' = 'bottom'

	@property({ type: Number })
	duration = 0

	protected firstUpdated() {
		this.closeElements.forEach((element) => element.addEventListener('click', () => this.hide()))
	}

	@property({ type: Boolean, reflect: true })
	open = false

	async show() {
		if (!this.dispatchEvent(new Event('app-show', { cancelable: true }))) {
			return
		}
		this.open = true
		await this.updateComplete
		this.snackbar.showPopover()
		await this.animation()
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide() {
		if (!this.dispatchEvent(new Event('app-hide', { cancelable: true }))) {
			return
		}
		await this.updateComplete
		await this.animation(true)
		this.snackbar.hidePopover()
		this.open = false
		this.dispatchEvent(new Event('app-after-hide'))
	}

	async animation(reverse = false) {
		const animation = this.snackbar.animate(
			[
				{ transform: 'translateY(-100px)', opacity: 0 },
				{ transform: 'translateY(0)', opacity: 1 },
			],
			{
				direction: reverse ? 'reverse' : 'normal',
				duration: 200,
				fill: 'both',
			}
		)
		return animation.finished
	}

	render() {
		return html`
			<div class="snackbar" popover="manual" class=${classMap({ [this.variant]: true, 'snackbar': true, [this.position]: true })}>
				<slot name="icon"></slot>
				<slot></slot>
				<slot name="action"></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-snackbar': AppSnackbar
	}
}

import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'

@customElement('app-snackbar')
export class AppSnackbar extends LitElement {
	static styles = css`
		:host {
			display: none;
		}

		:host([open]) {
			display: block;
		}
	`

	@query('.snackbar')
	snackbar!: HTMLDivElement

	@queryAssignedElements({ slot: 'action', selector: '[app-snackbar-close]' })
	actionElements!: Array<HTMLElement>

	@property({ type: String, reflect: true })
	type: 'default' | 'info' | 'success' | 'error' | 'warning' = 'default'

	@property({ type: Number })
	duration = 0

	protected firstUpdated() {
		this.actionElements.forEach((element) => element.addEventListener('click', () => this.hide()))
	}

	@property({ type: Boolean, reflect: true })
	open = false

	async show() {
		this.open = true
		await this.updateComplete
		this.snackbar.showPopover()
		this.dispatchEvent(new Event('app-show'))
		await this.animation()
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide() {
		await this.updateComplete
		this.dispatchEvent(new Event('app-hide'))
		await this.animation(true)
		this.snackbar.hidePopover()
		this.dispatchEvent(new Event('app-after-hide'))
		this.open = false
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
			<div class="snackbar" popover="manual">
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

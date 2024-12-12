import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

@customElement('app-snackbar')
export class AppSnackbar extends LitElement {
	static styles = css``

	@query('#snackbar')
	snackbar!: HTMLDivElement

	@queryAssignedElements({ slot: 'action', selector: '[app-snackbar-close]' })
	actionElements!: Array<HTMLElement>

	@property({ type: String, reflect: true })
	type: 'default' | 'success' | 'error' | 'warning' = 'default'

	@property({ type: Number })
	duration = 0

	protected firstUpdated() {
		this.actionElements.forEach((element) => element.addEventListener('click', () => this.hide()))
	}
	
	async show() {
		await this.updateComplete
		this.snackbar.showPopover()
		if (this.duration) {
			setTimeout(() => this.hide(), this.duration)
		}
		const animation = this.snackbar.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, iterations: 1, fill: 'forwards' })
		return animation.finished
	}

	async hide() {
		await this.updateComplete
		this.snackbar.hidePopover()
		const animation = this.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, iterations: 1, fill: 'forwards' })
		animation.addEventListener('finish', () => {
			this.dispatchEvent(new Event('app-after-hide'))
		})
		return animation.finished
	}

	render() {
		return html`
			<div id="snackbar" popover="manual">
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

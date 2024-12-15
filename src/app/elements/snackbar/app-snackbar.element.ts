import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { appSnackbarStyle } from './app-snackbar.style'
import { classMap } from 'lit/directives/class-map.js'
import { when } from 'lit/directives/when.js'
import { focusStyle } from '@app/styles/focus.style'

@customElement('app-snackbar')
export class AppSnackbar extends LitElement {
	static styles = [
		appSnackbarStyle,
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

	@query('.snackbar')
	snackbar!: HTMLDivElement

	@property({ type: String })
	action = ''

	@property({ type: String, reflect: true })
	variant: 'default' | 'primary' | 'success' | 'error' | 'warning' = 'default'

	@property({ type: String, reflect: true })
	position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left' = 'bottom'

	@property({ type: Number })
	duration = 3000

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
		if (this.duration && !this.action) {
			setTimeout(() => this.hide(), this.duration)
		}
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
		const y = this.position.includes('top') ? '-100px' : '100px'
		const animation = this.snackbar.animate(
			[
				{ transform: `translateY(${y})`, opacity: 0 },
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

	onAction() {
		if (!this.dispatchEvent(new Event('app-snackbar-action', { cancelable: true }))) {
			return
		}
		this.hide()
	}

	render() {
		return html`
			<div class="snackbar" popover="manual" class=${classMap({ snackbar: true, [this.variant]: true, [this.position]: true })}>
				<slot name="icon"></slot>
				<slot></slot>
				${when(this.action, () => html`<button class="focus-visible" @click=${this.onAction}>${this.action}</button>`)}
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-snackbar': AppSnackbar
	}
}

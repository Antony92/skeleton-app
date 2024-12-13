import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { focusStyle } from '@app/styles/focus.style'
import { appGlobalMessageStyle } from './app-global-message.style'

@customElement('app-global-message')
export class AppGlobalMessage extends LitElement {
	static styles = [
		appGlobalMessageStyle,
		focusStyle,
		css`
			:host {
				display: none;
			}

			:host([open]) {
				display: block;
			}

			.icon {
				font-size: 1.2rem;
			}
		`,
	]

	@property({ type: String, reflect: true })
	level: 'info' | 'warning' | 'error' = 'info'

	@query('.global-message')
	globalMessage!: HTMLDivElement

	@property({ type: Boolean, reflect: true })
	open = false

	async show() {
		this.open = true
		await this.updateComplete
		this.globalMessage.showPopover()
		this.dispatchEvent(new Event('app-show'))
		await this.animation()
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide() {
		await this.updateComplete
		this.dispatchEvent(new Event('app-hide'))
		await this.animation(true)
		this.globalMessage.hidePopover()
		this.dispatchEvent(new Event('app-after-hide'))
		this.open = false
	}

	async animation(reverse = false) {
		const animation = this.globalMessage.animate(
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
			<div class="global-message ${this.level}" popover="manual">
				${choose(
					this.level,
					[
						['info', () => html`<app-icon class="icon" name="info-circle"></app-icon>`],
						['warning', () => html`<app-icon class="icon" name="triangle-exclamation"></app-icon>`],
						['error', () => html`<app-icon class="icon" name="circle-exclamation"></app-icon>`],
					],
					() => html``
				)}
				<slot></slot>
				<button class="focus-visible" @click=${this.hide}>✕</button>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-global-message': AppGlobalMessage
	}
}

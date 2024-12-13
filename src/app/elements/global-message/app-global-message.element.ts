import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { faInfoCircleIcon, faTriangleExclamationIcon, faCircleExclamationIcon, iconStyle } from '@app/styles/icon.style'
import { focusStyle } from '@app/styles/focus.style'
import { appGlobalMessageStyle } from './app-global-message.style'

@customElement('app-global-message')
export class AppGlobalMessage extends LitElement {
	static styles = [appGlobalMessageStyle, iconStyle, focusStyle, css``]

	@property({ type: String, reflect: true })
	level: 'info' | 'warning' | 'error' = 'info'

	@query('.global-message')
	globalMessage!: HTMLDivElement

	@property({ type: Boolean, reflect: true })
	open = false

	protected firstUpdated() {
		this.globalMessage.addEventListener('toggle', async (event) => {
			const state = (event as ToggleEvent).newState
			await Promise.allSettled(this.globalMessage.getAnimations().map(a => a.finished))
			if (state === 'open') {
				this.open = true
				this.dispatchEvent(new Event('app-after-open'))
			}
			if (state === 'closed') {
				this.open = false
				this.dispatchEvent(new Event('app-after-hide'))
			}
		})
	}

	async show() {
		await this.updateComplete
		this.globalMessage.showPopover()
		await this.animation()
	}

	async hide() {
		await this.updateComplete
		await this.animation(true)
		this.globalMessage.hidePopover()
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
						['info', () => html`<i class="icon">${faInfoCircleIcon}</i>`],
						['warning', () => html`<i class="icon">${faTriangleExclamationIcon}</i>`],
						['error', () => html`<i class="icon">${faCircleExclamationIcon}</i>`],
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

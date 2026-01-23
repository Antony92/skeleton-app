import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { focusStyle } from '@app/styles/focus.style'
import { appGlobalMessageStyle } from '@app/elements/global-message/app-global-message.style'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-global-message')
export class AppGlobalMessage extends LitElement {
	static styles = [
		defaultStyle,
		appGlobalMessageStyle,
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
	accessor level: 'info' | 'warning' | 'error' = 'info'

	@query('.global-message')
	accessor globalMessage!: HTMLDivElement

	@property({ type: Boolean, reflect: true })
	accessor open = false

	async show() {
		this.dispatchEvent(new Event('app-show'))
		this.open = true
		await this.updateComplete
		this.globalMessage.showPopover()
		await this.animation()
		this.dispatchEvent(new Event('app-after-show'))
	}

	async hide() {
		this.dispatchEvent(new Event('app-hide'))
		await this.updateComplete
		await this.animation(true)
		this.globalMessage.hidePopover()
		this.open = false
		this.dispatchEvent(new Event('app-after-hide'))
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
			},
		)
		return animation.finished
	}

	render() {
		return html`
			<div class="global-message ${this.level}" popover="manual">
				${choose(
					this.level,
					[
						['info', () => html`<app-icon class="icon" filled>info</app-icon>`],
						['warning', () => html`<app-icon class="icon" filled>warning</app-icon>`],
						['error', () => html`<app-icon class="icon" filled>error</app-icon>`],
					],
					() => html``,
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

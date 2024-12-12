import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { faInfoCircleIcon, faTriangleExclamationIcon, faCircleExclamationIcon, iconStyle } from '@app/styles/icon.style'
import { focusStyle } from '@app/styles/focus.style'
import { buttonStyle } from '@app/styles/button.style'

@customElement('app-global-message')
export class AppGlobalMessage extends LitElement {
	static styles = [
		iconStyle,
		focusStyle,
		buttonStyle,
		css`
			.global-message {
				display: flex;
				align-items: center;
				gap: 10px;
				min-width: 300px;
				box-shadow: var(--shadow-2);
				padding: 15px;
				border: none;
				border-radius: 0.25rem;
				font-weight: var(--font-weight-5);
				
				&:popover-open {
					inset: unset;
					right: 0px;
					left: 0px;
					top: 15px;
				}

				&.info {
					background-color: var(--blue-7);
				}

				&.error {
					background-color: var(--red-7);
				}

				&.warning {
					background-color: var(--yellow-7);
				}

				.icon {
					width: var(--size-4);
					height: var(--size-4);
				}

				button {
					margin-left: auto;
					padding: 0;
				}
			}
		`,
	]

	@property({ type: String, reflect: true })
	type: 'info' | 'warning' | 'error' = 'info'

	@query('.global-message')
	globalMessage!: HTMLDivElement

	async show() {
		await this.updateComplete
		this.globalMessage.showPopover()
		const animation = this.globalMessage.animate(
			[
				{ transform: 'translateY(-100px)', opacity: 0 },
				{ transform: 'translateY(0)', opacity: 1 },
			],
			{
				duration: 300,
				fill: 'both',
			}
		)
		await animation.finished
	}

	async hide() {
		await this.updateComplete
		const animation = this.globalMessage.animate(
			[
				{ transform: 'translateY(0)', opacity: 1 },
				{ transform: 'translateY(-100px)', opacity: 0 },
			],
			{
				duration: 300,
				fill: 'both',
			}
		)
		await animation.finished
		this.globalMessage.hidePopover()
		this.dispatchEvent(new Event('app-after-hide'))
	}

	render() {
		return html`
			<div class="global-message ${this.type}" popover="manual">
				${choose(
					this.type,
					[
						['info', () => html`<i class="icon">${faInfoCircleIcon}</i>`],
						['warning', () => html`<i class="icon">${faTriangleExclamationIcon}</i>`],
						['error', () => html`<i class="icon">${faCircleExclamationIcon}</i>`],
					],
					() => html``
				)}
				<slot></slot>
				<button class="only-icon" @click=${this.hide}>✕</button>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-global-message': AppGlobalMessage
	}
}

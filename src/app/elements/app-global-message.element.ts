import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'

@customElement('app-global-message')
export class AppGlobalMessage extends LitElement {
	static styles = css`
		:host {
			position: fixed;
			top: 10px;
			left: 50%;
			translate: -50%;
			z-index: 6;
		}

		div {
			display: flex;
			align-items: center;
			gap: 10px;
			box-shadow: var(--sl-shadow-x-large);
			padding: 20px;
			border-radius: 0.25rem;
			color: var(--sl-color-neutral-0);
			visibility: hidden;
		}

		div.visible {
			visibility: visible;
		}

		.close {
			cursor: pointer;
		}

		div.info {
			background-color: var(--sl-color-primary-600);
		}

		div.warning {
			background-color: var(--sl-color-warning-600);
		}

		div.danger {
			background-color: var(--sl-color-danger-600);
		}
	`

	@query('div')
	container!: HTMLDivElement

	@state()
	message = ''

	show(message: string, type: 'info' | 'warning' | 'danger' = 'info') {
		this.message = message
		this.container.classList.add(type, 'visible')
		this.container.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, iterations: 1, fill: 'forwards' })
	}

	hide() {
		this.container
			.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, iterations: 1, fill: 'forwards' })
			.addEventListener('finish', () => {
				this.container.classList.remove('visible')
				this.dispatchEvent(
					new CustomEvent('app-after-hide', {
						bubbles: true,
						composed: true,
					})
				)
			})
	}

	override render() {
		return html`
			<div>
				<span>${this.message}</span>
				<span class="close" @click=${this.hide}>✕</span>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-global-message': AppGlobalMessage
	}
}

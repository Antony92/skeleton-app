import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { when } from 'lit/directives/when.js'

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

		.container {
			display: flex;
			align-items: center;
			gap: 10px;
			min-width: 300px;
			box-shadow: var(--sl-shadow-x-large);
			padding: 15px;
			border-radius: 0.25rem;
			color: var(--sl-color-neutral-0);
			font-size: var(--sl-button-font-size-medium);
			font-weight: bold;
			visibility: hidden;
		}

		sl-icon {
			font-size: 20px;
			flex-shrink: 0;
		}

		.container a {
			color: white;
		}

		.container.visible {
			visibility: visible;
		}

		.close {
			margin-left: auto;
			cursor: pointer;
		}

		.container.info {
			background-color: var(--sl-color-neutral-600);
		}

		.container.warning {
			background-color: var(--sl-color-warning-600);
		}

		.container.error {
			background-color: var(--sl-color-danger-600);
		}
	`

	@query('.container')
	container!: HTMLDivElement

	@state()
	type: 'info' | 'warning' | 'error' = 'info'

	@state()
	message = ''

	show(message: string, type: 'info' | 'warning' | 'error' = 'info') {
		this.type = type
		this.message = message
		this.container.classList.remove(...['info', 'warning', 'error'])
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

	render() {
		return html`
			<div class="container">
				${when(this.type === 'info', () => html`<sl-icon name="info-circle-fill"></sl-icon>`)}
				${when(this.type === 'warning', () => html`<sl-icon name="exclamation-triangle-fill"></sl-icon>`)}
				${when(this.type === 'error', () => html`<sl-icon name="exclamation-circle-fill"></sl-icon>`)}
				<div>${unsafeHTML(this.message)}</div>
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

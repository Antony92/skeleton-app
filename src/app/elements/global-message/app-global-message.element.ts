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

		.message-box {
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

			&.visible {
				visibility: visible;
			}

			&.info {
				background-color: var(--sl-color-neutral-600);
			}

			&.warning {
				background-color: var(--sl-color-warning-600);
			}

			&.error {
				background-color: var(--sl-color-danger-600);
			}

			sl-icon {
				font-size: 20px;
				flex-shrink: 0;
			}

			a {
				color: white;
			}

			.close {
				margin-left: auto;
				cursor: pointer;
			}
		}
	`

	@query('.message-box')
	messageBox!: HTMLDivElement

	@state()
	type: 'info' | 'warning' | 'error' = 'info'

	@state()
	message = ''

	show(message: string, type: 'info' | 'warning' | 'error' = 'info') {
		this.type = type
		this.message = message
		this.messageBox.classList.remove(...['info', 'warning', 'error'])
		this.messageBox.classList.add(type, 'visible')
		this.messageBox.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, iterations: 1, fill: 'forwards' })
	}

	hide() {
		this.messageBox
			.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, iterations: 1, fill: 'forwards' })
			.addEventListener('finish', () => {
				this.messageBox.classList.remove('visible')
				this.dispatchEvent(new Event('app-after-hide'))
			})
	}

	render() {
		return html`
			<div class="message-box">
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

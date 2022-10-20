import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

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
			opacity: 0;
			visibility: hidden;
			transition: 0.5s;
		}

		div.visible {
			opacity: 1;
			visibility: visible;
		}

		.close {
			cursor: pointer;
		}

		div.info {
			background-color: var(--sl-color-primary-200);
		}

		div.warning {
			background-color: var(--sl-color-warning-200);
		}

		div.danger {
			background-color: var(--sl-color-danger-200);
		}
	`

	@query('div')
	container!: HTMLDivElement

	@state()
	message = ''

	async show(message: string, type: 'info' | 'warning' | 'danger' = 'info') {
		this.message = message
		this.container.classList.add(type, 'visible')
	}

	async hide() {
		this.container.classList.remove('visible')
	}

	override firstUpdated() {
		this.container.addEventListener('transitionend', (event) => {
			if (!this.container.classList.contains('visible')) {
				this.dispatchEvent(new CustomEvent('app-after-hide', { bubbles: true, composed: true }))
			}
		})
	}

	override render() {
		return html`
			<div>
				${this.message}
				<span class="close" @click="${() => this.hide()}">✕</span>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-global-message': AppGlobalMessage
	}
}

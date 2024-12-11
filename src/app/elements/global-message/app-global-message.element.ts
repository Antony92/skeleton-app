import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
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

			sl-icon {
				font-size: 20px;
				flex-shrink: 0;
			}

			a {
				color: white;
			}

			.close {
				margin-left: auto;
				background: none;
				border: none;
				padding: 0;
				cursor: pointer;
			}
		}

		:host([type='info']) {
			background-color: var(--sl-color-neutral-600);
		}

		:host([type='warning']) {
			background-color: var(--sl-color-warning-600);
		}

		:host([type='error']) {
			background-color: var(--sl-color-danger-600);
		}
	`

	@property({ type: String, reflect: true })
	type: 'info' | 'warning' | 'error' = 'info'

	show() {
		const animation = this.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, iterations: 1, fill: 'forwards' })
		return animation.finished
	}

	hide() {
		const animation = this.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, iterations: 1, fill: 'forwards' })
		animation.addEventListener('finish', () => {
			this.dispatchEvent(new Event('app-after-hide'))
		})
		return animation.finished
	}

	render() {
		return html`
			<div id="globalmessage" popover="manual">
				${when(this.type === 'info', () => html`info`)}
				${when(this.type === 'warning', () => html`warning`)}
				${when(this.type === 'error', () => html`error`)}
				<slot></slot>
				<button class="close" @click=${this.hide}>✕</button>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-global-message': AppGlobalMessage
	}
}

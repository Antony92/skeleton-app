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
			transform: translateX(-50%);
			z-index: var(--sl-z-index-alert-group);
		}

		div {
			display: flex;
			align-items: center;
			gap: 10px;
			box-shadow: var(--sl-shadow-x-large);
			padding: 20px;
			border-radius: 0.25rem;
		}

		div[hidden] {
			display: none;
		}

		sl-icon {
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

	@query('sl-icon')
	closeIcon!: HTMLElementTagNameMap['sl-icon']

	@state()
	message = ''

    show(type: 'info' | 'warning' | 'danger' = 'info', message: string) {
        this.message = message
        this.container.className = type
        this.container.hidden = false
    }

    hide() {
        this.container.hidden = true
    }

	override firstUpdated() {
		this.closeIcon.addEventListener('click', () => this.hide())
        window.addEventListener('offline', () => this.show('danger', 'No internet connection'))
		window.addEventListener('online', () => this.hide())
	}

	override render() {
		return html`
			<div class="info" hidden>
				${this.message}
				<sl-icon name="x-lg"></sl-icon>
			</div>
		`
	}
}

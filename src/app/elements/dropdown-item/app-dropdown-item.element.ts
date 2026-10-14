import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

@customElement('app-dropdown-item')
export class AppDropdownItem extends LitElement {
	static styles = [
		defaultStyle,
		css`
			::slotted(app-icon) {
				font-size: 20px;
			}

			:host {
				color: var(--theme-color);
			}

			:host([variant="primary"]) {
				color: var(--theme-primary-color);
			}

			:host([variant="success"]) {
				color: var(--theme-success-color);
			}

			:host([variant="warning"]) {
				color: var(--theme-warning-color);
			}

			:host([variant="error"]) {
				color: var(--theme-error-color);
			}

			button,
			a {
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: 10px;
				border: none;
				padding: 10px;
				white-space: nowrap;
				height: 36px;
				width: 100%;
				background: none;
				text-decoration: none;
				font-family: var(--theme-font-family);
				font-size: var(--theme-font-size-1);
				border-radius: var(--radius-2);
				color: inherit;
				anchor-name: --anchor;

				.prefix,
				.suffix {
					display: flex;
					align-items: center;
					pointer-events: none;
				}

				.suffix {
					margin-left: auto;
				}

				&:not(:disabled, :focus-visible):hover {
					background: var(--theme-muted-background);
				}

				&:focus-visible {
					background: var(--theme-primary-background);
					color: var(--theme-white-color);
					outline: none;
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}

			[popover] {
				position-anchor: --anchor;
				width: fit-content;
				min-width: anchor-size(--anchor);
				position-area: right span-bottom;
				left: anchor(right);
				top: anchor(top);
				border: 1px solid var(--theme-default-color);
				background: var(--theme-default-surface);
				border-radius: var(--radius-2);
				overflow: auto;
				padding: 5px;
				margin: 0;

				&:popover-open {
					display: flex;
					flex-direction: column;
				}
			}
		`,
	];

	@property({ type: Boolean })
	accessor disabled = false;

	@property({ type: String })
	accessor value = '';

	@property({ type: String })
	accessor href = '';

	@property({ type: String })
	accessor variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

	@query('[popover]')
	accessor popup!: HTMLElement;

	@queryAssignedElements({ slot: 'submenu', selector: 'app-dropdown-item' })
	accessor submenuItems!: AppDropdownItem[];

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('mouseenter', (event) => {
			const target = event.target as HTMLElement;
			if (target === this && this.submenuItems.length > 0 && !this.popup.matches(':popover-open')) {
				this.popup.showPopover();
			}
		});
		this.addEventListener('mouseleave', (event) => {
			const target = event.target as HTMLElement;
			if (target === this && this.submenuItems.length > 0 && this.popup.matches(':popover-open')) {
				this.popup.hidePopover();
			}
		});
		this.addEventListener('click', (event: Event) => {
			const target = event.target as HTMLElement;
			if (target === this && this.submenuItems.length > 0) {
				event.stopPropagation();
				this.popup.showPopover();
			}
		});
	}

	protected firstUpdated() {
		this.popup.addEventListener('toggle', (event: Event) => {
			const toggleEvent = event as ToggleEvent;
			if (toggleEvent.newState === 'closed') {
				this.popup.hidePopover();
			}
		});
	}

	render() {
		return html`
			${when(
				this.href,
				() => html`
					<a part="item" href=${this.href}>
						<span class="prefix">
							<slot name="prefix"></slot>
						</span>
						<slot></slot>
						<span class="suffix">
							<slot name="suffix"></slot>
						</span>
					</a>
				`,
				() => html`
					<button part="item" ?disabled=${this.disabled} .value=${this.value}>
						<span class="prefix">
							<slot name="prefix"></slot>
						</span>
						<slot></slot>
						<span class="suffix">
							<slot name="suffix"></slot>
						</span>
					</button>
				`,
			)}
			<div part="popover" popover>
				<slot name="submenu"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dropdown-item': AppDropdownItem;
	}
}

import type { AppDropdownItem } from '@app/elements/dropdown-item/app-dropdown-item.element';
import { AppSelectEvent } from '@app/events/select.event';
import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('app-dropdown')
export class AppDropdown extends LitElement {
	static styles = [
		defaultStyle,
		css`
			.container {
				anchor-name: --anchor;
				width: fit-content;
			}

			[popover] {
				position-anchor: --anchor;
				width: fit-content;
				min-width: anchor-size(--anchor);
				position-try: flip-block;
				position-area: span-right;
				left: anchor(left);
				top: anchor(bottom);
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

	@query('[popover]')
	accessor popup!: HTMLElement;

	@property({ type: Boolean, reflect: true })
	accessor open = false;

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', (event: Event) => {
			const target = event.target as HTMLElement;
			if (target.assignedSlot?.name === 'trigger' || target.closest('[slot="trigger"]')) {
				event.stopPropagation();
				this.toggleDropdown();
			} else if (target.tagName === 'APP-DROPDOWN-ITEM') {
				event.stopPropagation();
				this.dispatchEvent(new AppSelectEvent((target as AppDropdownItem).value));
				this.closeDropdown();
			}
		});
	}

	protected firstUpdated() {
		this.popup.addEventListener('toggle', (event: Event) => {
			const toggleEvent = event as ToggleEvent;
			if (toggleEvent.newState === 'closed') {
				this.closeDropdown();
			}
		});
	}

	closeDropdown() {
		this.open = false;
		this.popup.hidePopover();
		this.popup.removeAttribute('style');
		this.dispatchEvent(new Event('app-hide', { cancelable: true }));
	}

	async openDropdown() {
		this.open = true;
		await this.updateComplete;
		this.popup.showPopover();
		this.dispatchEvent(new Event('app-show', { cancelable: true }));
	}

	toggleDropdown() {
		if (this.open) {
			this.closeDropdown();
		} else {
			this.openDropdown();
		}
	}

	render() {
		return html`
			<div class="container">
				<slot name="trigger"></slot>
				<div part="popover" popover>
					<slot></slot>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dropdown': AppDropdown;
	}
}

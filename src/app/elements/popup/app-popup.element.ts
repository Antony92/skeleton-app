import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

@customElement('app-popup')
export class AppPopup extends LitElement {
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
				position-area: top center;
				top: 0px;
				bottom: calc(anchor(top) + 5px);
				left: anchor(center);
				right: anchor(center);
				border: 1px solid var(--theme-default-color);
				background: var(--theme-default-surface);
				border-radius: var(--radius-2);
				overflow: auto;
				padding: 5px;
				margin: 0;
				white-space: nowrap;
				box-shadow: var(--shadow-4);

				&:popover-open {
					display: flex;
					align-items: center;
					gap: 10px;
				}
			}
		`,
	];

	@query('[popover]')
	accessor popup!: HTMLElement;

	@queryAssignedElements({ slot: 'trigger' })
	accessor triggers!: HTMLElement[];

	@property({ type: Boolean, reflect: true })
	accessor open = false;

	@property({ type: String })
	accessor behaviour: 'auto' | 'manual' = 'manual';

	@queryAssignedElements({ selector: '[app-popup-close]' })
	accessor closeElements!: HTMLElement[];

	protected firstUpdated() {
		this.popup.addEventListener('toggle', (event: Event) => {
			const toggleEvent = event as ToggleEvent;
			if (toggleEvent.newState === 'closed') {
				this.closePopup();
			}
		});
	}

	closePopup() {
		if (!this.dispatchEvent(new Event('app-hide', { cancelable: true }))) {
			return;
		}
		this.open = false;
		this.popup.hidePopover();
		this.popup.removeAttribute('style');
	}

	async openPopup() {
		if (!this.dispatchEvent(new Event('app-show', { cancelable: true }))) {
			return;
		}
		this.open = true;
		await this.updateComplete;
		this.popup.showPopover();
	}

	togglePopup() {
		if (this.open) {
			this.closePopup();
		} else {
			this.openPopup();
		}
	}

	onTriggersAdded() {
		this.triggers.forEach((trigger) => {
			trigger.addEventListener('click', () => this.togglePopup());
		});
	}

	onSlotChange() {
		this.closeElements.forEach((element) => {
			element.addEventListener('click', () => {
				this.closePopup();
			});
		});
	}

	render() {
		return html`
			<div class="container">
				<slot name="trigger" @slotchange=${this.onTriggersAdded}></slot>
				<div part="popover" popover=${this.behaviour}>
					<slot @slotchange=${this.onSlotChange}></slot>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-popup': AppPopup;
	}
}

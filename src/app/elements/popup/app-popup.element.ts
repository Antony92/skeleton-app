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
				overflow-wrap: break-word;
				white-space: normal;
				box-shadow: var(--shadow-4);

				&:popover-open {
					display: flex;
					flex-direction: column;
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

	protected firstUpdated() {
		this.triggers.forEach((trigger) => {
			trigger.addEventListener('click', () => this.togglePopup());
		});
		this.popup.addEventListener('toggle', (event: Event) => {
			const toggleEvent = event as ToggleEvent;
			if (toggleEvent.newState === 'closed') {
				this.closePopup();
			}
		});
	}

	closePopup() {
		this.open = false;
		this.popup.hidePopover();
		this.popup.removeAttribute('style');
		this.dispatchEvent(new Event('app-hide', { cancelable: true }));
	}

	async openPopup() {
		this.open = true;
		await this.updateComplete;
		this.popup.showPopover();
		this.dispatchEvent(new Event('app-show', { cancelable: true }));
	}

	togglePopup() {
		if (this.open) {
			this.closePopup();
		} else {
			this.openPopup();
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
		'app-popup': AppPopup;
	}
}

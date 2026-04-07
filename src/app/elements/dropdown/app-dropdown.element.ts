import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import type { AppDropdownItem } from '@app/elements/dropdown-item/app-dropdown-item.element'
import { AppSelectEvent } from '@app/events/select.event'
import { defaultStyle } from '@app/styles/default.style'

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
	]

	@query('[popover]')
	accessor popup!: HTMLElement

	@queryAssignedElements({ slot: 'trigger' })
	accessor triggers!: HTMLElement[]

	@queryAssignedElements({ selector: 'app-dropdown-item' })
	accessor assignedItems!: AppDropdownItem[]

	@property({ type: Boolean, reflect: true })
	accessor open = false

	private attachedItems = new WeakSet<AppDropdownItem>()

	protected firstUpdated() {
		this.triggers.forEach((trigger) => trigger.addEventListener('click', () => this.toggleDropdown()))
		this.popup.addEventListener('toggle', (event: Event) => {
			const toggleEvent = event as ToggleEvent
			if (toggleEvent.newState === 'closed') {
				this.closeDropdown()
			}
		})
	}

	closeDropdown() {
		this.open = false
		this.popup.hidePopover()
		this.popup.removeAttribute('style')
		this.dispatchEvent(new Event('app-hide', { cancelable: true }))
	}

	async openDropdown() {
		this.open = true
		await this.updateComplete
		this.popup.showPopover()
		this.dispatchEvent(new Event('app-show', { cancelable: true }))
	}

	toggleDropdown() {
		if (this.open) {
			this.closeDropdown()
		} else {
			this.openDropdown()
		}
	}

	private attachItemListeners(item: AppDropdownItem) {
		if (this.attachedItems.has(item)) {
			return
		}
		this.attachedItems.add(item)
		item.addEventListener('click', (event: Event) => {
			if (event.defaultPrevented) {
				return
			}
			this.dispatchEvent(new AppSelectEvent(item.value))
			this.closeDropdown()
		})
	}

	private onItemsAdded() {
		this.assignedItems.forEach((item) => this.attachItemListeners(item))
	}

	render() {
		return html`
			<div class="container">
				<slot name="trigger"></slot>
				<div part="popover" popover>
					<slot @slotchange=${this.onItemsAdded}></slot>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dropdown': AppDropdown
	}
}

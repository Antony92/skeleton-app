import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import type { AppDropdownItem } from '@app/elements/dropdown-item/app-dropdown-item.element'
import { AppSelectEvent } from '@app/events/select.event'

@customElement('app-dropdown')
export class AppDropdown extends LitElement {
	static styles = css`
		.container {
			anchor-name: --anchor;
			width: fit-content;
		}

		[popover] {
			inset: unset;
			position-anchor: --anchor;
			left: anchor(left);
  			top: anchor(bottom);
			border: 1px solid light-dark(var(--gray-4), var(--gray-8));
			background-color: var(--theme-default-layer);
			border-radius: var(--radius-2);
			overflow: auto;
			padding: 5px 0;
			margin: 0;

			&:popover-open {
				display: flex;
				flex-direction: column;
			}
		}
	`

	@query('[popover]')
	popup!: HTMLElement

	@queryAssignedElements({ slot: 'trigger' })
	triggers!: HTMLElement[]

	@queryAssignedElements({ selector: 'app-dropdown-item' })
	assignedItems!: AppDropdownItem[]

	@property({ type: Boolean, reflect: true })
	open = false

	private attachedItems = new WeakSet<AppDropdownItem>()

	connectedCallback() {
		super.connectedCallback()
	}

	protected firstUpdated() {
		this.triggers.forEach((trigger) => trigger.addEventListener('click', () => this.toggleDropdown(trigger)))
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

	async openDropdown(anchor: HTMLElement) {
		this.open = true
		await this.updateComplete
		this.popup.showPopover()
		// this.calculatePosition(anchor)
		this.dispatchEvent(new Event('app-show', { cancelable: true }))
	}

	toggleDropdown(anchor: HTMLElement) {
		if (this.open) {
			this.closeDropdown()
		} else {
			this.openDropdown(anchor)
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

	private calculatePosition(anchor: HTMLElement) {
		// Get the bounding rectangle of the anchor element.
		const anchorRect = anchor.getBoundingClientRect()

		// Get the viewport dimensions.
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		// Get the current height of the popup. It might be adjusted later.
		let popoverHeight = this.popup.offsetHeight
		// Get the width of the popup.
		const popoverWidth = this.popup.offsetWidth

		// Calculate the available space below the anchor.
		const spaceBelow = viewportHeight - anchorRect.bottom
		// Calculate the available space above the anchor.
		const spaceAbove = anchorRect.top
		// Calculate the available space to the right of the anchor.
		const spaceRight = viewportWidth - anchorRect.right
		// Calculate the available space to the left of the anchor.
		const spaceLeft = anchorRect.left

		// Get the current vertical scroll position of the window.
		const scrollY = Math.round(window.scrollY)

		// If there's more space above than below, and the space above is less than the current popover height,
		// reduce the popover's height to fit within the available space above (with a 15px margin).
		if (spaceAbove > spaceBelow && spaceAbove < popoverHeight) {
			this.popup.style.height = `${spaceAbove - 15}px`
			// Update the popover height after resizing.
			popoverHeight = this.popup.offsetHeight
		}

		// If there's more space below than above, and the space below is less than the current popover height,
		// reduce the popover's height to fit within the available space below (with a 15px margin).
		if (spaceBelow > spaceAbove && spaceBelow < popoverHeight) {
			this.popup.style.height = `${spaceBelow - 15}px`
			// Update the popover height after resizing.
			popoverHeight = this.popup.offsetHeight
		}

		// Default positioning: place the top of the popup below the bottom of the anchor,
		// and the left side of the popup aligned with the left side of the anchor.
		// Add the vertical scroll offset to the top position to account for scrolling.
		this.popup.style.insetBlockStart = `${anchorRect.top + scrollY + anchorRect.height}px`
		this.popup.style.insetInlineStart = `${anchorRect.left}px`

		// If there's more space above than below, position the top of the popup above the top of the anchor.
		// Calculate the top position by subtracting the popover's height from the anchor's bottom position,
		// and adding the vertical scroll offset.
		if (spaceAbove > spaceBelow && spaceBelow < popoverHeight) {
			this.popup.style.insetBlockStart = `${anchorRect.bottom - anchorRect.height - popoverHeight + scrollY}px`
		}

		// If there's more space to the left than to the right, position the right side of the popup aligned with the right side of the anchor.
		// Calculate the left position by subtracting the popover's width from the anchor's right position.
		if (spaceLeft > spaceRight) {
			this.popup.style.insetInlineStart = `${anchorRect.right - popoverWidth}px`
		}
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

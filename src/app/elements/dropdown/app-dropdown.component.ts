import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'

@customElement('app-dropdown')
export class AppDropdown extends LitElement {
	static styles = css`
		div[popover] {
			inset: unset;
			position: absolute;
			overflow: auto;
		}
	`

	@query('div[popover]')
	dropdown!: HTMLElement

	@queryAssignedElements({ slot: 'trigger' })
	triggers!: HTMLElement[]

	@property({ type: Boolean })
	open = false

	protected firstUpdated() {
		this.triggers.forEach((trigger) => trigger.addEventListener('click', () => this.toggleDropdown(trigger)))
		this.dropdown.addEventListener('toggle', (event) => {
			this.open = (<ToggleEvent>event).newState === 'open'
			if (!this.open) {
				this.dropdown.removeAttribute('style')
			}
		})
	}

	toggleDropdown(anchor: HTMLElement) {
		if (this.open) {
			this.dropdown.hidePopover()
			this.dispatchEvent(new Event('app-hide', { cancelable: true }))
		} else {
			this.dropdown.showPopover()
			this.calculatePosition(anchor)
			this.dispatchEvent(new Event('app-show', { cancelable: true }))
		}
	}

	private calculatePosition(anchor: HTMLElement) {
		const anchorRect = anchor.getBoundingClientRect()

		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		const spaceBelow = viewportHeight - anchorRect.bottom
		const spaceAbove = anchorRect.top
		const spaceRight = viewportWidth - anchorRect.right
		const spaceLeft = anchorRect.left

		if (spaceAbove > spaceBelow && spaceAbove < this.dropdown.offsetHeight) {
			this.dropdown.style.height = spaceAbove < this.dropdown.offsetHeight ? `${spaceAbove - 15}px` : 'auto'
		}

		if (spaceBelow > spaceAbove && spaceBelow < this.dropdown.offsetHeight) {
			this.dropdown.style.height = spaceAbove < this.dropdown.offsetHeight ? `${spaceBelow - 15}px` : 'auto'
		}

		if (spaceAbove > spaceBelow && spaceBelow < this.dropdown.offsetHeight) {
			this.dropdown.style.top = `${anchor.offsetTop - this.dropdown.offsetHeight}px`
		} else {
			this.dropdown.style.top = `${anchor.offsetTop + anchorRect.height}px`
		}

		if (spaceLeft > spaceRight && spaceRight < this.dropdown.offsetWidth) {
			this.dropdown.style.right = `${viewportWidth - anchorRect.left - anchorRect.width}px`
			this.dropdown.style.left = 'auto'
		} else {
			this.dropdown.style.left = `${anchorRect.left}px`
			this.dropdown.style.right = 'auto'
		}
	}

	render() {
		return html`
			<slot name="trigger"></slot>
			<div popover>
				<ul>
					<li>Menu Item 1</li>
					<li>Menu Item 2</li>
					<li>Menu Item 2</li>
					<li>Menu Item 2</li>
					<li>Menu Item 2</li>
				</ul>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-dropdown': AppDropdown
	}
}

import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'
import { AppDropdownItem } from '@app/elements/dropdown-item/app-dropdown-item.element'
import { AppSelectEvent } from '@app/events/select.event'

@customElement('app-dropdown')
export class AppDropdown extends LitElement {
	static styles = css`
		.container {
			position: relative;
			width: fit-content;
		}

		#popover {
			display: none;
			position: absolute;
			border: 1px solid light-dark(var(--gray-4), var(--gray-8));
			background-color: var(--theme-default-layer);
			border-radius: var(--radius-2);
			overflow: auto;
			padding: 5px 0;
			margin: 0;

			&[open] {
				display: flex;
				flex-direction: column;
				z-index: var(--layer-5);
			}
		}
	`

	@query('#popover')
	popup!: HTMLElement

	@queryAssignedElements({ slot: 'trigger' })
	triggers!: HTMLElement[]

	@queryAssignedElements({ selector: 'app-dropdown-item' })
	items!: AppDropdownItem[]

	@property({ type: Boolean })
	open = false

	connectedCallback() {
		super.connectedCallback()
	}

	protected firstUpdated() {
		this.triggers.forEach((trigger) => trigger.addEventListener('click', () => this.toggleDropdown(trigger)))
		this.items.forEach((item) =>
			item.addEventListener('click', () => {
				this.dispatchEvent(new AppSelectEvent(item.value))
				this.closeDropdown()
			})
		)
	}

	closeDropdown() {
		window.removeEventListener('keyup', this.handleKeyup)
		window.removeEventListener('mousedown', this.handleMouseDown)
		this.open = false
		this.popup.removeAttribute('style')
		this.dispatchEvent(new Event('app-hide', { cancelable: true }))
	}

	async openDropdown(anchor: HTMLElement) {
		this.open = true
		await this.updateComplete
		this.calculatePosition(anchor)
		this.dispatchEvent(new Event('app-show', { cancelable: true }))
		window.addEventListener('keyup', this.handleKeyup)
		window.addEventListener('mousedown', this.handleMouseDown)
	}

	toggleDropdown(anchor: HTMLElement) {
		if (this.open) {
			this.closeDropdown()
		} else {
			this.openDropdown(anchor)
		}
	}

	private handleMouseDown = (event: MouseEvent) => {
		const path = event.composedPath()
		if (!path.includes(this)) {
			this.closeDropdown()
		}
	}

	private handleKeyup = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.closeDropdown()
		}
	}

	private calculatePosition(anchor: HTMLElement) {
		const anchorRect = anchor.getBoundingClientRect()

		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		const popoverHeight = this.popup.offsetHeight
		const popoverWidth = this.popup.offsetWidth

		const spaceBelow = viewportHeight - anchorRect.bottom
		const spaceAbove = anchorRect.top
		const spaceRight = viewportWidth - anchorRect.right
		const spaceLeft = anchorRect.left

		// default position
		this.popup.style.top = `auto`
		this.popup.style.bottom = `auto`
		this.popup.style.left = `auto`
		this.popup.style.right = `auto`

		if (spaceAbove > spaceBelow && spaceBelow < popoverHeight) {
			this.popup.style.bottom = `${anchorRect.height}px`
			this.popup.style.top = `auto`
		}

		if (spaceLeft > spaceRight && spaceRight < popoverWidth) {
			this.popup.style.right = `0px`
			this.popup.style.left = `auto`
		}

		if (spaceAbove > spaceBelow && spaceAbove < popoverHeight) {
			this.popup.style.height = `${spaceAbove - 15}px`
		}

		if (spaceBelow > spaceAbove && spaceBelow < popoverHeight) {
			this.popup.style.height = `${spaceBelow - 15}px`
		}
	}

	render() {
		return html`
			<div class="container">
				<slot name="trigger"></slot>
				<div id="popover" part="popover" ?open=${this.open}>
					<slot></slot>
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

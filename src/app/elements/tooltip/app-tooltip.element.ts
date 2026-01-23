import { defaultStyle } from '@app/styles/default.style'
import { focusStyle } from '@app/styles/focus.style'
import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js'

@customElement('app-tooltip')
export class AppTooltip extends LitElement {
	static styles = [
		defaultStyle,
		focusStyle,
		css`
			:host {
				display: contents;
			}

			slot {
				display: contents;
			}

			::slotted(*) {
				anchor-name: --anchor;
			}

			[popover] {
				position-anchor: --anchor;
				position-try: flip-block;
				border: none;
				position-area: right center;
				top: anchor(center);
				bottom: anchor(center);
				right: anchor(right);
				background-color: var(--gray-9);
				color: var(--white);
				border-radius: 4px;
				padding: 5px;
				margin: 0;
				font-size: 12px;
				font-weight: 500;
				overflow-wrap: break-word;
				white-space: normal;

				&:popover-open {
					display: flex;
					flex-direction: column;
				}
			}

			:host([position='top']) [popover] {
				position-area: top center;
				bottom: anchor(top);
				left: anchor(center);
				right: anchor(center);
			}

			:host([position='bottom']) [popover] {
				position-area: bottom center;
				top: anchor(bottom);
				left: anchor(center);
				right: anchor(center);
			}

			:host([position='left']) [popover] {
				position-area: left center;
				top: anchor(center);
				bottom: anchor(center);
				left: anchor(left);
			}

			:host([position='right']) [popover] {
				position-area: right center;
				top: anchor(center);
				bottom: anchor(center);
				right: anchor(right);
			}
		`,
	]

	@property({ type: String })
	accessor content = ''

	@property({ type: Number })
	accessor delay = 100

	@property({ type: Boolean, attribute: 'on-overflow-only' })
	accessor onOverflowOnly = false

	@property({ type: String })
	accessor position: 'top' | 'left' | 'right' | 'bottom' = 'bottom'

	@query('[popover]')
	accessor popup!: HTMLElement

	@queryAssignedElements()
	accessor triggers!: HTMLElement[]

	private timeout = 0

	get trigger() {
		return this.triggers[0]
	}

	protected firstUpdated() {
		this.trigger.addEventListener('mouseover', () => {
			if (this.timeout !== 0) {
				return
			}
			const isOverflowing = this.trigger.scrollWidth > this.trigger.clientWidth
			if (this.onOverflowOnly && !isOverflowing) {
				return
			}
			this.timeout = setTimeout(() => this.popup.showPopover(), this.delay)
		})
		this.trigger.addEventListener('mouseleave', () => {
			clearTimeout(this.timeout)
			this.timeout = 0
			this.popup.hidePopover()
		})
	}

	render() {
		return html`
			<slot></slot>
			<div class="tooltip" popover>${this.content}</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tooltip': AppTooltip
	}
}

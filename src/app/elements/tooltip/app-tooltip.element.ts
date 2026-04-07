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
				width: fit-content;
				display: block;
			}

			.anchor {
				anchor-name: --anchor;
			}

			[popover] {
				position-anchor: --anchor;
				position-try: flip-block;
				position-area: bottom center;
				top: calc(anchor(bottom) + 5px);
				left: anchor(center);
				right: anchor(center);
				bottom: 0px;
				border: none;
				background-color: var(--theme-background-inverse);
				color: var(--theme-color-inverse);
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
				top: 0px;
				bottom: calc(anchor(top) + 5px);
				left: anchor(center);
				right: anchor(center);
			}

			:host([position='bottom']) [popover] {
				position-area: bottom center;
				top: calc(anchor(bottom) + 5px);
				bottom: 0px;
				left: anchor(center);
				right: anchor(center);
			}

			:host([position='left']) [popover] {
				position-area: left center;
				top: anchor(center);
				bottom: anchor(center);
				right: calc(anchor(left) + 5px);
				left: 0px;
			}

			:host([position='right']) [popover] {
				position-area: right center;
				top: anchor(center);
				bottom: anchor(center);
				right: 0px;
				left: calc(anchor(right) + 5px);
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

	connectedCallback(): void {
		super.connectedCallback()
		this.addEventListener('mouseover', () => {
      if (this.timeout !== 0) return
			const isOverflowing = this.trigger && this.trigger.scrollWidth > this.trigger.clientWidth
			if (this.onOverflowOnly && !isOverflowing) return
			this.timeout = setTimeout(() => this.popup.showPopover(), this.delay)
    })
    this.addEventListener('mouseleave', () => {
			clearTimeout(this.timeout)
			this.timeout = 0
			this.popup.hidePopover()
		})
	}

	render() {
		return html`
			<div class="anchor">
				<slot></slot>
			</div>
			<div class="tooltip" popover>
				<slot name="content">${this.content}</slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tooltip': AppTooltip
	}
}

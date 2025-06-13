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

      [popover] {
        position: absolute;
        border: none;
        background-color: var(--gray-9);
        color: var(--white);
        border-radius: 4px;
        padding: 5px;
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        max-width: 300px;
        overflow-wrap: break-word;
        white-space: normal;

        &:popover-open {
          display: flex;
          flex-direction: column;
        }
      }
    `,
  ]

  @property({ type: String })
  content = ''

  @property({ type: Number })
  delay = 100

  @property({ type: String })
  position: 'top' | 'left' | 'right' | 'bottom' = 'bottom'

  @query('[popover]')
  popup!: HTMLElement

  @queryAssignedElements()
  triggers!: HTMLElement[]

  private timeout = 0

  get trigger() {
    return this.triggers[0]
  }

  protected firstUpdated() {
    this.trigger.addEventListener('mouseover', (event: MouseEvent) => {
      if (event.target !== this.trigger || this.timeout !== 0) {
        return
      }
      this.timeout = setTimeout(() => {
        this.popup.showPopover()
        this.calculatePosition(this.trigger)
      }, this.delay)
    })
    this.trigger.addEventListener('mouseleave', () => {
      clearTimeout(this.timeout)
      this.timeout = 0
      this.popup.hidePopover()
    })
  }

  private calculatePosition(anchor: HTMLElement) {
    // Get the bounding rectangle of the anchor element.
    const anchorRect = anchor.getBoundingClientRect()

    // Get the current height of the popup.
    const popoverHeight = this.popup.offsetHeight
    // Get the width of the popup.
    const popoverWidth = this.popup.offsetWidth

    // Calculate the available space to the left of the anchor.
    const spaceLeft = anchorRect.left

    // Get the current vertical scroll position of the window.
    const scrollY = Math.round(window.scrollY)

    // margin
    const margin = 5

    // Pre-calculate half offsets for centering the popover relative to the anchor
    const horizontalCenterOffset = (anchorRect.width - popoverWidth) / 2
    const verticalCenterOffset = (anchorRect.height - popoverHeight) / 2

    // Initialize popup's top and left positions
    let popupTop = 0
    let popupLeft = 0

    // Determine the popover's position based on 'this.position'
    switch (this.position) {
      case 'top':
        // Position above the anchor
        popupTop = anchorRect.top - popoverHeight - margin + scrollY
        // Attempt to center horizontally
        popupLeft = anchorRect.left + horizontalCenterOffset

        // If there's not enough space on the left to center,
        // snap the popover's left edge to the anchor's left edge.
        // We use Math.abs because horizontalCenterOffset can be negative if popover is wider.
        if (spaceLeft < Math.abs(horizontalCenterOffset)) {
          popupLeft = anchorRect.left
        }
        break

      case 'bottom':
        // Position below the anchor
        popupTop = anchorRect.bottom + margin + scrollY // anchorRect.top + anchorRect.height + margin + scrollY is equivalent
        // Attempt to center horizontally
        popupLeft = anchorRect.left + horizontalCenterOffset

        // If there's not enough space on the left to center,
        // snap the popover's left edge to the anchor's left edge.
        if (spaceLeft < Math.abs(horizontalCenterOffset)) {
          popupLeft = anchorRect.left
        }
        break

      case 'left':
        // Position to the left of the anchor
        popupLeft = anchorRect.left - popoverWidth - margin
        // Attempt to center vertically
        popupTop = anchorRect.top + verticalCenterOffset + scrollY
        break

      case 'right':
        // Position to the right of the anchor
        popupLeft = anchorRect.right + margin // anchorRect.left + anchorRect.width + margin is equivalent
        // Attempt to center vertically
        popupTop = anchorRect.top + verticalCenterOffset + scrollY
        break

      default:
        return
    }

    // Apply the calculated styles
    this.popup.style.top = `${popupTop}px`
    this.popup.style.left = `${popupLeft}px`
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

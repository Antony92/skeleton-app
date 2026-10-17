import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

@customElement('app-tree-item')
export class AppTreeItem extends LitElement {
  static styles = [
    defaultStyle,
    focusStyle,
    css`
      .container {
        display: flex;
        gap: 5px;
        flex-direction: column;

        .tree-item {
          display: flex;
          align-items: center;
          gap: 5px;

          .expand-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            button {
              background: none;
              border: none;
              cursor: pointer;
              transition: 250ms rotate ease;
              transform-box: fill-box;
              display: flex;
              align-items: center;

              &.expanded {
                rotate: 90deg;
              }

              svg {
                height: 1em;
                overflow: visible;
                width: auto;
              }
            }
          }
        }

        .tree-item-children {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 0;
          transition: 250ms height ease;
          margin-left: 2em;

          &.expanded {
            height: auto;
          }
        }
      }
    `,
  ];

  @property({ type: String })
  accessor value = '';

  @property({ type: Boolean })
  accessor expanded = false;

  @property({ type: Boolean, reflect: true })
  accessor selected = false;

  @property({ type: Boolean })
  accessor disabled = false;

  @property({ type: String })
  accessor selection: 'leaf' | 'multiple' = 'leaf';

  @property({ type: Boolean, attribute: false })
  accessor indeterminate = false;

  @property({ type: Boolean, attribute: false })
  accessor isLeaf = true;

  @queryAssignedElements({ slot: 'children', selector: 'app-tree-item' })
  accessor treeItems!: AppTreeItem[];

  private isExternalChange = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('app-change', (event) => {
      if (event.target !== this && this.selection !== 'leaf') {
        this.isExternalChange = true;
        this.selected = this.treeItems.every((item) => item.selected);
        this.indeterminate =
          this.treeItems.some((item) => item.selected || item.indeterminate) &&
          this.treeItems.some((item) => !item.selected);
      }
    });
    if (this.parentElement?.tagName === 'APP-TREE-ITEM') {
      this.setAttribute('slot', 'children');
    }
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('selected') && !this.isExternalChange) {
      this.treeItems.forEach((item) => {
        item.selected = this.selected;
        item.indeterminate = false;
      });
    }
    this.isExternalChange = false;
  }

  onChildrenSlotChange() {
    this.isLeaf = this.treeItems.length === 0;
    this.indeterminate =
      this.treeItems.some((item) => item.selected) && this.treeItems.some((item) => !item.selected);
  }

  onChange(event: Event) {
    this.selected = (event.target as HTMLInputElement).checked;
    this.indeterminate = false;
    this.isExternalChange = false;
    this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="container">
        <div class="tree-item" part="tree-item">
          <div class="expand-button" part="expand-button">
            ${when(
              !this.isLeaf,
              () => html`
                <button
                  id="expand-button"
                  class=${classMap({ expanded: this.expanded })}
                  @click=${() => (this.expanded = !this.expanded)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    part="svg"
                    fill="currentColor"
                  >
                    <path
                      d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    ></path>
                  </svg>
                </button>
              `,
            )}
          </div>
          <input
            type="checkbox"
            id="checkbox"
            .checked=${this.selected}
            .indeterminate=${this.indeterminate}
            @change=${this.onChange}
            ?hidden=${this.selection === 'leaf' && !this.isLeaf}
            ?disabled=${this.disabled || (this.selection === 'leaf' && !this.isLeaf)}
          />
          <label
            for="${this.selection === 'multiple' || (this.selection === 'leaf' && this.isLeaf) ? 'checkbox' : 'expand-button'}"
          >
            <slot></slot>
          </label>
        </div>
        <div
          class=${classMap({ expanded: this.expanded, 'tree-item-children': true })}
          part="tree-item-children"
        >
          <slot name="children" @slotchange=${this.onChildrenSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-tree-item': AppTreeItem;
  }
}

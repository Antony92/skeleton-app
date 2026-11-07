import { AppTableHeaderFilterEvent } from '@app/events/table.event';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import '@app/elements/icon/app-icon.element';
import '@app/elements/select/app-select.element';
import '@app/elements/select-option/app-select-option.element';
import '@app/elements/input/app-input.element';
import '@app/elements/popup/app-popup.element';
import type { AppInput } from '@app/elements/input/app-input.element';
import type { AppSelect } from '@app/elements/select/app-select.element';
import { defaultStyle } from '@app/styles/default.style';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('app-table-header')
export class AppTableHeader extends LitElement {
  static styles = [
    defaultStyle,
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 100px;
        gap: 10px;
        height: 20px;
      }

      button.header {
        display: flex;
        align-items: center;
        font-family: var(--font-system-ui);
        padding: 0;
        gap: 5px;
        font-weight: bold;
        border: none;
        background: none;

        &.sortable {
          cursor: pointer;

          app-icon {
            font-size: 20px;
            transition: opacity 0.3s;
          }

          &[data-order='none'] {
            app-icon {
              opacity: 0;
            }

            &:not(:focus):hover app-icon {
              opacity: 0.5;
            }
          }

          &:not([data-order='none']) {
            color: var(--theme-primary-color);
          }
        }
      }

      button.filter {
        display: flex;
        align-items: center;
        font-family: var(--font-system-ui);
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
        transition:
          color 0.3s ease-in-out,
          background 0.3s ease-in-out;
        color: var(--theme-muted-color);
        border-radius: 50%;
        padding: 2px;

        app-icon {
          pointer-events: none;
          font-size: 16px;
        }

        &[data-has-value] {
          color: var(--theme-white-color);
          background: var(--theme-primary-color);
        }

        &:hover:not([data-has-value]) {
          color: var(--theme-primary-color);
        }
      }

      .filter-popup {
        min-width: 200px;
        padding: 5px;

        .actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
      }
    `,
  ];

  @property({ type: String })
  accessor label = '';

  @property({ type: Boolean })
  accessor sortable = false;

  @property({ type: String })
  accessor order: 'asc' | 'desc' | null = null;

  @property({ type: Boolean })
  accessor filterable = false;

  @property({ type: String })
  accessor field = '';

  @property({ type: String })
  accessor value = '';

  @property({ type: String, reflect: true })
  accessor type: 'text' | 'number' | 'date' | 'select' | 'select-multiple' = 'text';

  @property({ type: Array })
  accessor list: { label: string; value: string | boolean | number }[] = [];

  dispatchFilterEvent(type: 'order' | 'value' = 'value') {
    this.dispatchEvent(
      new AppTableHeaderFilterEvent({
        field: this.field,
        value: this.value,
        order: this.order,
        type,
      }),
    );
  }

  private onFilterColumnValue(event: Event) {
    const input = event.target as AppInput | AppSelect;
    this.value = input.value;
  }

  private onFilterColumnOrder() {
    if (!this.sortable) return;

    if (!this.order) {
      this.order = 'asc';
    } else if (this.order === 'asc') {
      this.order = 'desc';
    } else if (this.order === 'desc') {
      this.order = null;
    }
    this.dispatchFilterEvent('order');
  }

  clearFilters() {
    this.clearOrderFilter();
    this.clearValueFilter();
  }

  clearOrderFilter() {
    this.order = null;
  }

  clearValueFilter() {
    this.value = '';
  }

  private apply() {
    this.dispatchFilterEvent('value');
  }

  private clear() {
    this.value = '';
    this.dispatchFilterEvent('value');
  }

  render() {
    return html`
      <button
        data-order=${this.order || 'none'}
        class=${classMap({ header: true, sortable: this.sortable })}
        @click=${this.onFilterColumnOrder}
      >
        <slot></slot>
        ${when(this.sortable && !this.order, () => html`<app-icon>sort</app-icon>`)}
        ${when(this.sortable && this.order === 'desc', () => html`<app-icon>arrow_downward_alt</app-icon>`)}
        ${when(this.sortable && this.order === 'asc', () => html`<app-icon>arrow_upward_alt</app-icon>`)}
      </button>
      ${when(
        this.filterable,
        () => html`
          <app-popup>
            <button
              ?data-has-value=${!!this.value}
              class="filter"
              slot="trigger"
              title="Filter by ${this.label?.toLowerCase()}"
            >
              <app-icon>filter_alt</app-icon>
            </button>
            <div class="filter-popup">
              ${choose(
                this.type,
                [
                  [
                    'number',
                    () => html`
                      <app-input
                        type="number"
                        label=${ifDefined(this.label)}
                        clearable
                        placeholder="Filter by ${this.label?.toLowerCase()}"
                        .value=${this.value}
                        @app-change=${this.onFilterColumnValue}
                      >
                      </app-input>
                    `,
                  ],
                  [
                    'select',
                    () => html`
                      <app-select
                        clearable
                        label=${ifDefined(this.label)}
                        placeholder="Filter by ${this.label?.toLowerCase()}"
                        @app-change=${this.onFilterColumnValue}
                        .value=${this.value}
                      >
                        ${this.list?.map((item) => html`<app-select-option value=${item.value?.toString()}>${item.label}</app-select-option>`)}
                      </app-select>
                    `,
                  ],
                  [
                    'select-multiple',
                    () => html`
                      <app-select
                        clearable
                        label=${ifDefined(this.label)}
                        placeholder="Filter by ${this.label?.toLowerCase()}"
                        @app-change=${this.onFilterColumnValue}
                        .value=${this.value}
                      >
                        ${this.list?.map((item) => html`<app-select-option value=${item.value?.toString()}>${item.label}</app-select-option>`)}
                      </app-select>
                    `,
                  ],
                ],
                () => html`
                  <app-input
                    clearable
                    label=${ifDefined(this.label)}
                    placeholder="Filter by ${this.label?.toLowerCase()}"
                    .value=${this.value}
                    @app-change=${this.onFilterColumnValue}
                  >
                  </app-input>
                `,
              )}
              <div class="actions">
                <app-button
                  variant="primary"
                  appearance="plain"
                  app-popup-close
                  @click=${this.clear}
                >
                  Clear
                </app-button>
                <app-button variant="primary" app-popup-close @click=${this.apply}>
                  Apply
                </app-button>
              </div>
            </div>
          </app-popup>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-table-header': AppTableHeader;
  }
}

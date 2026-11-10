import { AppTableHeaderFilterEvent } from '@app/events/table.event';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defaultStyle } from '@app/styles/default.style';
import '@app/elements/icon/app-icon.element';
import '@app/elements/select/app-select.element';
import '@app/elements/option/app-option.element';
import '@app/elements/input/app-input.element';
import '@app/elements/popup/app-popup.element';
import type { AppInput } from '@app/elements/input/app-input.element';
import type { AppSelect } from '@app/elements/select/app-select.element';

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

      .actions {
        display: flex;
        align-items: center;
        gap: 5px;

        button {
          display: flex;
          align-items: center;
          font-family: var(--font-system-ui);
          padding: 0;
          border: none;
          background-color: transparent;
          cursor: pointer;
          transform-origin: center center;
          transition:
            color 0.2s ease-in-out,
            background-color 0.2s ease-in-out;
          color: var(--theme-muted-color);
          border-radius: 50%;
          padding: 2px;

          app-icon {
            pointer-events: none;
            font-size: 16px;
          }

          &[data-has-value] {
            color: var(--theme-white-color);
            background-color: var(--theme-primary-color);
          }

          &:hover:not([data-has-value]) {
            color: var(--theme-primary-color);
          }
        }
      }

      .filter-popup {
        min-width: 200px;
        padding: 5px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .filter-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

  @property({ type: Boolean })
  accessor frozen = false;

  @property({ type: Boolean })
  accessor freezable = false;

  @property({ type: Array })
  accessor list: { label: string; value: string | boolean | number }[] = [];

  @state()
  accessor fromDate = '';

  @state()
  accessor toDate = '';

  @state()
  accessor draftValue = '';

  override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('value')) {
      this.draftValue = this.value;
      if (this.type === 'date') {
        const [fromDate = '', toDate = ''] = this.draftValue.split(',').filter(Boolean);
        this.fromDate = fromDate;
        this.toDate = toDate;
      }
    }
  }

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
    this.draftValue = input.value;
  }

  private onFilterColumnDateValue(event: Event) {
    const input = event.target as AppInput;
    if (input.name === 'fromDate') this.fromDate = input.value;
    if (input.name === 'toDate') this.toDate = input.value;
    this.draftValue = [this.fromDate, this.toDate].filter(Boolean).join(',');
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
    this.draftValue = '';
  }

  private apply() {
    this.value = this.draftValue;
    this.dispatchFilterEvent('value');
  }

  private clear() {
    this.draftValue = '';
    this.value = '';
    this.dispatchFilterEvent('value');
  }

  toggleColumnFreeze() {
    this.frozen = !this.frozen;
    this.dispatchEvent(new Event('app-table-column-freeze'));
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
      <div class="actions">
        ${when(
          this.freezable,
          () => html`
            <button ?data-has-value=${this.frozen} title="Freeze" @click=${this.toggleColumnFreeze}>
              <app-icon filled>snowflake</app-icon>
            </button>
          `,
        )}
        ${when(
          this.filterable,
          () => html`
            <app-popup>
              <button
                ?data-has-value=${!!this.value}
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
                          .value=${this.draftValue}
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
                          .value=${this.draftValue}
                        >
                          ${this.list?.map(
                            (item) => html`
                              <app-option value=${item.value?.toString()}>
                                ${item.label}
                              </app-option>
                            `,
                          )}
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
                          .value=${this.draftValue}
                        >
                          ${this.list?.map(
                            (item) => html`
                              <app-option value=${item.value?.toString()}>
                                ${item.label}
                              </app-option>
                            `,
                          )}
                        </app-select>
                      `,
                    ],
                    [
                      'date',
                      () => html`
                        <app-input
                          type="date"
                          label="From Date"
                          name="fromDate"
                          clearable
                          placeholder="Filter by ${this.label?.toLowerCase()}"
                          .value=${this.fromDate}
                          max=${this.toDate}
                          @app-change=${this.onFilterColumnDateValue}
                        >
                        </app-input>
                        <app-input
                          type="date"
                          label="To Date"
                          name="toDate"
                          min=${this.fromDate}
                          clearable
                          placeholder="Filter by ${this.label?.toLowerCase()}"
                          .value=${this.toDate}
                          @app-change=${this.onFilterColumnDateValue}
                        >
                        </app-input>
                      `,
                    ],
                  ],
                  () => html`
                    <app-input
                      clearable
                      label=${ifDefined(this.label)}
                      placeholder="Filter by ${this.label?.toLowerCase()}"
                      .value=${this.draftValue}
                      @app-change=${this.onFilterColumnValue}
                    >
                    </app-input>
                  `,
                )}
                <div class="filter-actions">
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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-table-header': AppTableHeader;
  }
}

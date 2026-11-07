import { css, html, LitElement } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '@app/elements/button/app-button.element';
import '@app/elements/icon/app-icon.element';
import '@app/elements/input/app-input.element';
import '@app/elements/popup/app-popup.element';
import '@app/elements/checkbox/app-checkbox.element';
import type { AppInput } from '@app/elements/input/app-input.element';
import { AppTableFilterEvent, type AppTableHeaderFilterEvent } from '@app/events/table.event';
import { defaultStyle } from '@app/styles/default.style';
import type { TableColumn } from '@app/types/table.type';
import { debounce } from '@app/utils/html';

@customElement('app-table')
export class AppTable extends LitElement {
  static styles = [
    defaultStyle,
    css`
      header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;

        h3 {
          margin: 0;
        }

        app-input {
          width: 100%;

          @media (min-width: 768px) {
            width: 300px;
          }
        }

        .actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          width: 100%;

          @media (min-width: 768px) {
            margin-left: auto;
            width: fit-content;
          }
        }
      }

      main {
        overflow-x: auto;
      }

      footer {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;

        .configuration {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0 5px 5px 5px;

          h5 {
            margin: 0;
          }

          .columns {
            overflow-y: auto;
            max-height: 300px;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
        }
      }
    `,
  ];

  @property({ type: String })
  accessor header = '';

  @property({ type: Boolean })
  accessor searchable = false;

  @property({ type: Boolean })
  accessor clearable = false;

  @property({ type: Boolean })
  accessor configurable = false;

  @property({ type: Map })
  accessor filtersMap = new Map();

  @property({ type: Array })
  accessor columns: TableColumn[] = [];

  @queryAssignedElements({ slot: 'table', selector: 'table' })
  accessor tables!: HTMLTableElement[];

  @state()
  accessor filtersApplied = false;

  @state()
  accessor searchValue = '';

  private debouncedSearch?: ReturnType<typeof debounce>;
  private tableObserver?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('app-table-header-filter', (event) => {
      event.stopPropagation();
      const { type } = event.filter;
      if (type === 'order') this.onHeaderOrderFilter(event);
      if (type === 'value') this.onHeaderValueFilter(event);
      this.dispatchFilterEvent();
    });
    this.filtersApplied = this.hasFiltersApplied();
    this.syncColumnsWithFilters();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.tableObserver?.disconnect();
  }

  syncColumnsWithFilters() {
    this.searchValue = this.filtersMap.get('search') ?? '';
    this.filtersMap.forEach((value, key) => {
      const column = this.columns.find((col) => col.field === key);
      if (column) column.value = value;
      if (key === 'sort') {
        const sortColumn = this.columns.find((col) => col.field === value);
        if (sortColumn) sortColumn.order = this.filtersMap.get('order');
      }
    });
  }

  search(value: string) {
    if (value) {
      this.filtersMap.set('search', value);
    } else {
      this.filtersMap.delete('search');
    }
    this.searchValue = value;
    if (!this.debouncedSearch) {
      this.debouncedSearch = debounce(() => this.dispatchFilterEvent(), 300);
    }
    return this.debouncedSearch();
  }

  clearSearch() {
    this.searchValue = '';
    this.filtersMap.delete('search');
    this.dispatchFilterEvent();
  }

  hasFiltersApplied() {
    return this.filtersMap.size > 0;
  }

  dispatchFilterEvent() {
    this.filtersApplied = this.hasFiltersApplied();
    const filters = new Map(this.filtersMap);
    this.dispatchEvent(new AppTableFilterEvent(filters));
  }

  clearAllFilters() {
    this.filtersMap.clear();
    this.filtersApplied = false;
    this.searchValue = '';
    this.headers.forEach((header) => {
      header.clearFilters();
    });
    this.columns.forEach((column) => {
      column.order = null;
      column.value = '';
    });
    this.dispatchFilterEvent();
    this.dispatchEvent(new Event('app-table-clear'));
  }

  get headers() {
    const table = this.tables[0];
    return Array.from(table?.querySelectorAll('app-table-header') || []);
  }

  onHeaderValueFilter(event: AppTableHeaderFilterEvent) {
    const { field, value } = event.filter;
    if (value) {
      this.filtersMap.set(field, value);
    } else {
      this.filtersMap.delete(field);
    }
  }

  onHeaderOrderFilter(event: AppTableHeaderFilterEvent) {
    const { field, order } = event.filter;
    if (order) {
      this.filtersMap.set('sort', field);
      this.filtersMap.set('order', order);
    } else {
      this.filtersMap.delete('sort');
      this.filtersMap.delete('order');
    }
    this.headers
      .filter((header) => header !== event.target)
      .forEach((header) => {
        header.clearOrderFilter();
      });
  }

  syncStickyColumns() {
    const table = this.tables[0];
    if (!table) return;
    const headers = table.querySelectorAll<HTMLTableCellElement>('thead th');
    let stickyStart = 0;
    headers.forEach((header) => {
      const index = header.cellIndex;
      const cells = table.querySelectorAll<HTMLTableCellElement>(
        `tbody tr td:nth-child(${index + 1})`,
      );
      if (header.hasAttribute('data-sticky')) {
        const width = header.getBoundingClientRect().width;
        header.style.setProperty('--sticky-start', `${stickyStart}px`);
        cells.forEach((cell) => {
          cell.classList.add('sticky');
          cell.style.setProperty('--sticky-start', `${stickyStart}px`);
        });
        stickyStart += width;
      } else {
        header.style.removeProperty('--sticky-start');
        cells.forEach((cell) => {
          cell.classList.remove('sticky');
          cell.style.removeProperty('--sticky-start');
        });
      }
    });
  }

  onTableSlotChange() {
    this.tableObserver?.disconnect();
    const table = this.tables[0];
    if (!table) return;
    this.tableObserver = new MutationObserver(() => {
      this.syncStickyColumns();
    });
    this.tableObserver.observe(table, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-sticky'],
    });
  }

  dispatchTableUpdate() {
    this.dispatchEvent(new Event('app-table-update'));
  }

  render() {
    return html`
      <header>
        <h3>${this.header}</h3>
        <div class="actions">
          ${when(
            this.searchable,
            () => html`
              <app-input
                autocomplete="off"
                .value=${this.searchValue}
                clearable
                placeholder="Search"
                @app-input=${(event: Event) => this.search((event.target as AppInput).value)}
                @app-clear=${this.clearSearch}
              >
                <app-icon slot="prefix" filled>search</app-icon>
              </app-input>
            `,
          )}
          ${when(
            this.clearable,
            () => html`
              <app-button
                variant="primary"
                appearance="outlined"
                @click=${this.clearAllFilters}
                ?disabled=${!this.filtersApplied}
              >
                <app-icon filled>filter_alt_off</app-icon>
                Clear
              </app-button>
            `,
          )}
          <slot name="actions"></slot>
        </div>
      </header>
      <main>
        <slot name="table" @slotchange=${this.onTableSlotChange}></slot>
      </main>
      <footer>
        <slot name="paginator"></slot>
        ${when(
          this.configurable,
          () => html`
            <app-popup>
              <app-button
                variant="primary"
                appearance="plain"
                slot="trigger"
                title="Column Configuration"
              >
                <app-icon filled>settings</app-icon>
              </app-button>
              <div class="configuration">
                <h5>Column Configuration</h5>
                <div class="columns">
                  ${this.columns.map(
                    (column) => html`
                      <app-checkbox
                        label=${column.header}
                        ?checked=${!column.hidden}
                        ?disabled=${column.default}
                        @app-change=${() => {
                          column.hidden = !column.hidden;
                          this.dispatchTableUpdate();
                        }}
                      >
                      </app-checkbox>
                    `,
                  )}
                </div>
              </div>
            </app-popup>
          `,
        )}
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-table': AppTable;
  }
}

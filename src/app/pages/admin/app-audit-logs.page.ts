import type { AppDialog } from '@app/elements/dialog/app-dialog.element';
import type { AppPaginator } from '@app/elements/paginator/app-paginator.element';
import type { AppPaginateEvent } from '@app/events/pagination.event';
import { getAuditLogs } from '@app/services/audit-logs.service';
import { getRouteSearchMap, addSearchToRoute, clearRouteSearch } from '@app/shared/navigation';
import { pageStyle } from '@app/styles/page.style';
import { tableStyle } from '@app/styles/table.style';
import type { AuditLog } from '@app/types/audit-logs.type';
import type { PaginatedResponse } from '@app/types/response.type';
import type { TableColumn } from '@app/types/table.type';
import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import '@app/elements/table/app-table.element';
import '@app/elements/table-header/app-table-header.element';
import '@app/elements/paginator/app-paginator.element';
import '@app/elements/button/app-button.element';
import '@app/elements/badge/app-badge.element';
import '@app/elements/dialog/app-dialog.element';
import '@app/elements/badge/app-badge.element';
import { formatDate } from '@app/utils/format';

@customElement('app-audit-logs-page')
export class AppAuditLogsPage extends LitElement {
  static override styles = [
    pageStyle,
    tableStyle,
    css`
      pre {
        overflow: auto;
        max-height: 350px;
        border-radius: var(--radius-2);
        background-color: var(--theme-muted-background);
        padding: 10px;
      }
    `,
  ];

  @state()
  auditLogs: PaginatedResponse<AuditLog> = {
    data: [],
    total: 0,
  };

  @state()
  loading = true;

  @query('app-paginator')
  paginator!: AppPaginator;

  @query('#data-dialog')
  dataDialog!: AppDialog;

  @state()
  data = '';

  filtersMap = new Map();
  skip = 0;
  limit = 10;
  storageLimitName = 'audit-logs-table-limit';
  private abortController?: AbortController;

  columns: TableColumn<AuditLog>[] = [
    {
      header: 'Name',
      field: 'name',
      type: 'text',
      sortable: true,
      filterable: true,
      freezable: true,
      frozen: true,
    },
    {
      header: 'Username',
      field: 'username',
      type: 'text',
      sortable: true,
      filterable: true,
      freezable: true,
      default: true,
    },
    {
      header: 'Target',
      field: 'target',
      type: 'text',
      sortable: true,
      filterable: true,
      default: true,
      render: (value) => html` <app-badge> ${value.target} </app-badge> `,
    },
    {
      header: 'Action',
      field: 'action',
      type: 'select',
      sortable: true,
      filterable: true,
      default: true,
      list: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
      ],
      render: (value) => html`
        <app-badge variant=${value.action === 'delete' ? 'error' : 'success'}>
          ${value.action}
        </app-badge>
      `,
    },
    {
      header: 'Message',
      field: 'message',
      type: 'text',
      sortable: true,
      filterable: true,
      textlimit: true,
    },
    {
      header: 'Created',
      field: 'created',
      type: 'date',
      filterable: true,
      sortable: true,
      render: (value) => html`${formatDate(value.created)}`,
    },
  ];

  override connectedCallback() {
    super.connectedCallback();
    setPageTitle('Audit Logs');
    this.filtersMap = getRouteSearchMap();
    this.limit = Number(localStorage.getItem(this.storageLimitName)) || this.limit;
    this.skip = Number(this.filtersMap.get('skip')) || this.skip;
    void this.loadAuditLogs();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.abortController?.abort();
  }

  async loadAuditLogs() {
    this.loading = true;
    this.abortController?.abort();
    this.abortController = new AbortController();
    const filters = Object.fromEntries(this.filtersMap);
    this.auditLogs = await getAuditLogs(
      { ...filters, skip: this.skip, limit: this.limit },
      this.abortController.signal,
    );
    this.loading = false;
  }

  async syncRouteAndReload() {
    const filters = Object.fromEntries(this.filtersMap);
    addSearchToRoute(filters);
    void this.loadAuditLogs();
  }

  onPaginate(event: AppPaginateEvent) {
    const { pageSize, pageIndex } = event.value;
    this.limit = pageSize;
    this.skip = pageSize * pageIndex;
    this.filtersMap.set('skip', this.skip);
    void this.syncRouteAndReload();
  }

  async onTableFilter() {
    this.skip = 0;
    this.filtersMap.delete('skip');
    await this.syncRouteAndReload();
    this.paginator.reset();
  }

  onTableClear() {
    clearRouteSearch();
  }

  onTableUpdate() {
    this.requestUpdate();
  }

  get visibleColumns(): TableColumn<AuditLog>[] {
    return this.columns.filter((column) => !column.hidden);
  }

  openDataDialog(auditLog: AuditLog) {
    this.data = JSON.stringify(auditLog.data, null, 2);
    void this.dataDialog.show();
  }

  override render() {
    return html`
      <app-table
        header="Audit Logs"
        searchable
        clearable
        configurable
        @app-table-update=${this.onTableUpdate}
        @app-table-clear=${this.onTableClear}
        @app-table-filter=${this.onTableFilter}
        .columns=${this.columns}
        .filtersMap=${this.filtersMap}
      >
        <app-button
          title="Refresh"
          slot="actions"
          variant="primary"
          appearance="outlined"
          @click=${this.loadAuditLogs}
        >
          <app-icon>refresh</app-icon>
        </app-button>
        <table slot="table" class="hoverable">
          <thead>
            <tr>
              <th data-action data-frozen>Action</th>
              ${this.visibleColumns.map(
                (column) => html`
                  <th ?data-frozen=${column.frozen}>
                    <app-table-header
                      ?sortable=${column.sortable}
                      ?filterable=${column.filterable}
                      ?freezable=${column.freezable}
                      .label=${column.header}
                      .field=${column.field}
                      .type=${column.type || 'text'}
                      .list=${column.list || []}
                      .value=${column.value || ''}
                      .order=${column.order || null}
                      .frozen=${column.frozen ?? false}
                      @app-table-column-freeze=${() => {
                        column.frozen = !column.frozen;
                        this.requestUpdate();
                      }}
                    >
                      ${column.header}
                    </app-table-header>
                  </th>
                `,
              )}
            </tr>
          </thead>
          <tbody>
            ${repeat(
              this.auditLogs.data,
              (auditLog) => auditLog.id,
              (auditLog) => html`
                <tr>
                  <td>
                    <app-button
                      variant="primary"
                      appearance="plain"
                      size="small"
                      @click=${() => this.openDataDialog(auditLog)}
                    >
                      <app-icon filled>info</app-icon>
                    </app-button>
                  </td>
                  ${this.visibleColumns.map((column) => {
                    const value = auditLog[column.field as keyof AuditLog];
                    return html`
                      <td
                        ?data-textlimit=${column.textlimit}
                        title=${ifDefined(column.textlimit ? value : undefined)}
                      >
                        ${column.render ? column.render(auditLog) : value}
                      </td>
                    `;
                  })}
                </tr>
              `,
            )}
            ${when(
              this.auditLogs.data.length === 0 && this.loading,
              () => html`
                <tr>
                  <td colspan=${this.visibleColumns.length + 2}>Loading...</td>
                </tr>
              `,
            )}
            ${when(
              this.auditLogs.data.length === 0 && !this.loading,
              () => html`
                <tr>
                  <td colspan=${this.visibleColumns.length + 2}>No results found</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
        <app-paginator
          slot="paginator"
          save-page-size=${this.storageLimitName}
          @app-paginate=${this.onPaginate}
          .pageSize=${this.limit}
          .pageIndex=${this.skip / this.limit}
          .pageSizeOptions=${[10, 50, 100]}
          .total=${this.auditLogs.total}
        >
        </app-paginator>
      </app-table>

      <app-dialog header="Audit Log Details" id="data-dialog">
        <pre><code>${this.data}</code></pre>
      </app-dialog>
    `;
  }
}

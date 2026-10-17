import { getUsers } from '@app/services/api.service';
import { tableStyle } from '@app/styles/table.style';
import type { PaginatedResponse } from '@app/types/response.type';
import { serializeForm, setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '@app/elements/table/app-table.element';
import '@app/elements/table-header/app-table-header.element';
import '@app/elements/paginator/app-paginator.element';
import '@app/elements/dropdown/app-dropdown.element';
import '@app/elements/dropdown-item/app-dropdown-item.element';
import '@app/elements/dialog/app-dialog.element';
import '@app/elements/input/app-input.element';
import '@app/elements/button/app-button.element';
import type { AppDialog } from '@app/elements/dialog/app-dialog.element';
import type { AppPaginator } from '@app/elements/paginator/app-paginator.element';
import type { AppPaginateEvent } from '@app/events/pagination.event';
import { confirmDialog } from '@app/shared/dialogs';
import { addSearchToRoute, clearRouteSearch, getRouteSearchMap } from '@app/shared/navigation';
import { notify } from '@app/shared/notification';
import { formStyle } from '@app/styles/form.style';
import type { TableColumn } from '@app/types/table.type';
import { when } from 'lit/directives/when.js';

@customElement('app-table-page')
export class AppTablePage extends LitElement {
  static styles = [
    formStyle,
    tableStyle,
    css`
      h3 {
        margin: 0 0 10px 0;
      }

      th[sticky]:nth-child(2),
      td[sticky]:nth-child(2) {
        --sticky-start: 35px;
      }
    `,
  ];

  @state()
  users: PaginatedResponse<any> = {
    data: [],
    total: 0,
  };

  @state()
  selectedUser: any = null;

  @state()
  loading = true;

  @query('app-paginator')
  paginator!: AppPaginator;

  @query('#user-dialog')
  userDialog!: AppDialog;

  @query('#user-dialog form')
  userForm!: HTMLFormElement;

  filtersMap = new Map();
  skip = 0;
  limit = 10;
  storageLimitName = 'table-limit';

  columns: TableColumn[] = [
    { header: '#', field: 'id', type: 'number', sortable: true, filtarable: true, delay: 300 },
    {
      header: 'Username',
      field: 'username',
      type: 'text',
      sortable: true,
      filtarable: true,
      delay: 300,
    },
    {
      header: 'First Name',
      field: 'firstName',
      type: 'text',
      sortable: true,
      filtarable: true,
      delay: 300,
    },
    { header: 'Last Name', field: 'lastName', type: 'text', filtarable: true, delay: 300 },
    { header: 'Email', field: 'email', type: 'text', filtarable: true, delay: 300 },
    { header: 'User Agent', field: 'userAgent', type: 'text', filtarable: true, delay: 300 },
    {
      header: 'Role',
      field: 'role',
      type: 'select',
      filtarable: true,
      list: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
      ],
    },
  ];

  connectedCallback() {
    super.connectedCallback();
    setPageTitle('Table');
    this.filtersMap = getRouteSearchMap();
    this.limit = Number(localStorage.getItem(this.storageLimitName)) || this.limit;
    this.skip = Number(this.filtersMap.get('skip')) || this.skip;
    void this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    const filters = Object.fromEntries(this.filtersMap);
    this.users = await getUsers({ ...filters, skip: this.skip, limit: this.limit });
    this.loading = false;
  }

  async syncRouteAndReload() {
    const filters = Object.fromEntries(this.filtersMap);
    addSearchToRoute(filters);
    void this.loadUsers();
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

  toggleSelection(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.users.data.forEach((user) => {
      user.selected = checked;
    });
    this.requestUpdate();
  }

  toggleSelected(user: any) {
    user.selected = !user.selected;
    this.requestUpdate();
  }

  async saveUser(event: Event) {
    event.preventDefault();
    if (!this.userForm.checkValidity()) {
      this.userForm.querySelector<HTMLElement>('*:state(invalid)')?.focus();
      return;
    }
    const data = serializeForm(this.userForm);
    const index = this.users.data.indexOf(this.selectedUser);
    this.users.data.splice(index, 1, { id: 1, ...this.selectedUser, ...data });
    void this.userDialog.hide();
    this.requestUpdate();
    void notify({
      message: `User ${this.selectedUser ? 'updated' : 'created'}`,
      variant: 'success',
    });
  }

  async openUserDialog(user?: any) {
    if (!user) this.userForm.reset();
    this.selectedUser = user;
    void this.userDialog.show();
  }

  async deleteUser(user: any) {
    const confirmed = await confirmDialog({
      message: `Are you sure you want to delete user ${user.firstName} ${user.lastName}?`,
    });
    if (confirmed) {
      const index = this.users.data.indexOf(user);
      this.users.data.splice(index, 1);
      this.requestUpdate();
      void notify({
        variant: 'success',
        message: `User ${user.firstName} ${user.lastName} has been deleted.`,
      });
    }
  }

  render() {
    return html`
      <app-table
        header="Table"
        searchable
        clearable
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
          @click=${() => this.loadUsers()}
        >
          <app-icon>refresh</app-icon>
        </app-button>
        <app-button
          title="Create user"
          slot="actions"
          variant="primary"
          @click=${() => this.openUserDialog()}
        >
          <app-icon>add</app-icon>
          Create
        </app-button>
        <table slot="table" class="hoverable">
          <thead>
            <tr>
              <th action sticky>
                <input
                  type="checkbox"
                  @change=${this.toggleSelection}
                  .checked=${this.users.data.length > 0 && this.users.data.every((user) => user.selected)}
                  .indeterminate=${this.users.data.some((user) => user.selected) && this.users.data.some((user) => !user.selected)}
                />
              </th>
              <th action sticky>Actions</th>
              ${this.columns.map(
                (column) => html`
                  <th>
                    <app-table-header
                      ?sortable=${column.sortable}
                      ?filterable=${column.filtarable}
                      .label=${column.header}
                      .field=${column.field}
                      .type=${column.type || 'text'}
                      .delay=${column.delay || 0}
                      .list=${column.list || []}
                      .value=${column.value || ''}
                      .order=${column.order || null}
                    >
                      ${column.header}
                    </app-table-header>
                  </th>
                `,
              )}
            </tr>
          </thead>
          <tbody>
            ${this.users.data.map(
              (user) => html`
                <tr>
                  <td sticky>
                    <input
                      type="checkbox"
                      .checked=${user.selected}
                      @change=${() => this.toggleSelected(user)}
                    />
                  </td>
                  <td sticky>
                    <app-dropdown>
                      <app-button slot="trigger" variant="primary" appearance="plain" size="small">
                        <app-icon filled>more_horiz</app-icon>
                      </app-button>
                      <app-dropdown-item @click=${() => this.openUserDialog(user)}>
                        <app-icon slot="prefix">edit_square</app-icon>
                        Edit
                      </app-dropdown-item>
                      <app-dropdown-item @click=${() => this.deleteUser(user)} variant="error">
                        <app-icon slot="prefix">delete</app-icon>
                        Delete
                      </app-dropdown-item>
                    </app-dropdown>
                  </td>
                  <td>
                    <a href="/test/${user.id}">${user.id} </a>
                  </td>
                  <td>${user.username}</td>
                  <td>${user.firstName}</td>
                  <td>${user.lastName}</td>
                  <td>${user.email}</td>
                  <td textlimit title=${user.userAgent}>${user.userAgent}</td>
                  <td>${user.role}</td>
                </tr>
              `,
            )}
            ${when(
              this.users.data.length === 0 && this.loading,
              () => html`
                <tr>
                  <td colspan=${this.columns.length + 2}>Loading...</td>
                </tr>
              `,
            )}
            ${when(
              this.users.data.length === 0 && !this.loading,
              () => html`
                <tr>
                  <td colspan=${this.columns.length + 2}>No results found</td>
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
          .total=${this.users.total}
        >
        </app-paginator>
      </app-table>

      <app-dialog
        id="user-dialog"
        header="${this.selectedUser ? 'Update' : 'Create'} User"
        modal
        @app-after-hide=${() => (this.selectedUser = null)}
      >
        <form @submit=${this.saveUser} novalidate>
          <app-input
            label="Username"
            name="username"
            required
            .value=${this.selectedUser?.username || ''}
          ></app-input>
          <app-input
            label="First Name"
            name="firstName"
            required
            .value=${this.selectedUser?.firstName || ''}
          ></app-input>
          <app-input
            label="Last Name"
            name="lastName"
            required
            .value=${this.selectedUser?.lastName || ''}
          ></app-input>
        </form>
        <app-button slot="footer" variant="primary" appearance="plain" app-dialog-close
          >Cancel</app-button
        >
        <app-button
          slot="footer"
          variant="primary"
          autofocus
          @click=${() => this.userForm.requestSubmit()}
        >
          ${this.selectedUser ? 'Update' : 'Create'}
        </app-button>
      </app-dialog>
    `;
  }
}

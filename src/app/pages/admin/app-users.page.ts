import { createUser, deleteUser, getUsers, updateUser } from '@app/services/user.service';
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
import '@app/elements/badge/app-badge.element';
import '@app/elements/select/app-select.element';
import '@app/elements/option/app-option.element';
import type { AppDialog } from '@app/elements/dialog/app-dialog.element';
import type { AppPaginator } from '@app/elements/paginator/app-paginator.element';
import type { AppPaginateEvent } from '@app/events/pagination.event';
import { confirmDialog } from '@app/shared/dialogs';
import {
  addSearchToRoute,
  clearRouteSearch,
  getRouteSearchMap,
  navigate,
} from '@app/shared/navigation';
import { notify } from '@app/shared/notification';
import { formStyle } from '@app/styles/form.style';
import { pageStyle } from '@app/styles/page.style';
import type { TableColumn } from '@app/types/table.type';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { formatDate } from '@app/utils/format';
import type { DbUser, User } from '@app/types/user.type';
import { getUser, impersonate } from '@app/shared/auth';

@customElement('app-users-page')
export class AppUsersPage extends LitElement {
  static override styles = [
    formStyle,
    pageStyle,
    tableStyle,
    css`
      h3 {
        margin: 0 0 10px 0;
      }
    `,
  ];

  @state()
  users: PaginatedResponse<DbUser> = {
    data: [],
    total: 0,
  };

  @state()
  selectedUser?: DbUser;

  @state()
  selection: Map<string, DbUser> = new Map();

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
  storageLimitName = 'user-table-limit';
  private abortController?: AbortController;

  currentUser?: User;

  columns: TableColumn<DbUser>[] = [
    {
      header: 'ID',
      field: 'id',
      type: 'number',
      sortable: true,
      filterable: true,
      default: true,
      freezable: true,
    },
    {
      header: 'Username',
      field: 'username',
      type: 'text',
      sortable: true,
      filterable: true,
      freezable: true,
      default: true,
      frozen: true,
    },
    {
      header: 'Name',
      field: 'name',
      type: 'text',
      sortable: true,
      filterable: true,
    },
    {
      header: 'Active',
      field: 'active',
      type: 'select',
      filterable: true,
      sortable: true,
      default: true,
      list: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      render: (value) =>
        html`${when(
          value.active,
          () => html`<app-badge variant="success">Yes</app-badge>`,
          () => html`<app-badge variant="error">No</app-badge>`,
        )}`,
    },
    {
      header: 'Blocked',
      field: 'blocked',
      type: 'select',
      filterable: true,
      sortable: true,
      default: true,
      list: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      render: (value) =>
        html`${when(
          value.blocked,
          () => html`<app-badge variant="error">Yes</app-badge>`,
          () => html`<app-badge variant="success">No</app-badge>`,
        )}`,
    },
    {
      header: 'Internal',
      field: 'internal',
      type: 'select',
      filterable: true,
      sortable: true,
      default: true,
      list: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      render: (value) =>
        html`${when(
          value.internal,
          () => html`<app-badge variant="primary">Yes</app-badge>`,
          () => html`<app-badge>No</app-badge>`,
        )}`,
    },
    {
      header: 'Created',
      field: 'created',
      type: 'date',
      filterable: true,
      sortable: true,
      render: (value) => html`${formatDate(value.created)}`,
    },
    {
      header: 'Updated',
      field: 'updated',
      type: 'date',
      filterable: true,
      sortable: true,
      render: (value) => html`${formatDate(value.updated)}`,
    },
    {
      header: 'Last Login',
      field: 'lastLogin',
      type: 'date',
      filterable: true,
      sortable: true,
      render: (value) => html`${formatDate(value.lastLogin)}`,
    },
    {
      header: 'Role',
      field: 'roles',
      type: 'select-multiple',
      filterable: true,
      list: [
        { label: 'Admin', value: 'admin' },
        { label: 'Guest', value: 'guest' },
      ],
      render: (value) =>
        html`${value.roles.map((role) => html`<app-badge variant="primary">${role}</app-badge>`)}`,
    },
  ];

  override connectedCallback() {
    super.connectedCallback();
    setPageTitle('Users');
    this.filtersMap = getRouteSearchMap();
    this.limit = Number(localStorage.getItem(this.storageLimitName)) || this.limit;
    this.skip = Number(this.filtersMap.get('skip')) || this.skip;
    this.currentUser = getUser();
    void this.loadUsers();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.abortController?.abort();
  }

  async loadUsers() {
    this.loading = true;
    this.abortController?.abort();
    this.abortController = new AbortController();
    const filters = Object.fromEntries(this.filtersMap);
    this.users = await getUsers(
      { ...filters, skip: this.skip, limit: this.limit },
      this.abortController.signal,
    );
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

  onTableUpdate() {
    this.requestUpdate();
  }

  toggleSelection(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.users.data.forEach((user) => {
        this.selection.set(user.id, user);
      });
    } else {
      this.users.data.forEach((user) => {
        this.selection.delete(user.id);
      });
    }
    this.requestUpdate();
  }

  toggleSelected(event: Event, user: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selection.set(user.id, user);
    } else {
      this.selection.delete(user.id);
    }
    this.requestUpdate();
  }

  get isAllSelected(): boolean {
    const len = this.users.data.length;
    return (
      len > 0 &&
      this.selection.size >= len &&
      this.users.data.every((u) => this.selection.has(u.id))
    );
  }

  get isIndeterminate(): boolean {
    const len = this.users.data.length;
    const count = this.users.data.filter((u) => this.selection.has(u.id)).length;
    return count > 0 && count < len;
  }

  get visibleColumns(): TableColumn<DbUser>[] {
    return this.columns.filter((column) => !column.hidden);
  }

  async saveUser(event: Event) {
    event.preventDefault();
    if (!this.userForm.checkValidity()) {
      this.userForm.querySelector<HTMLElement>('*:state(invalid)')?.focus();
      return;
    }
    const data = serializeForm(this.userForm) as Record<string, string | undefined>;
    if (this.selectedUser) {
      await updateUser({
        id: this.selectedUser.id,
        name: data.name,
        username: data.username,
        roles: data.roles?.split(','),
        blocked: data.blocked === 'on',
      });
    } else {
      await createUser({
        name: data.name!,
        username: data.username!,
        roles: data.roles?.split(','),
      });
    }
    await this.loadUsers();
    void this.userDialog.close();
    void notify({
      message: `User ${this.selectedUser ? 'updated' : 'created'}`,
      variant: 'success',
    });
  }

  async openUserDialog(user?: DbUser) {
    if (!user) this.userForm.reset();
    this.selectedUser = user;
    void this.userDialog.show();
  }

  async deleteUser(user: DbUser) {
    const confirmed = await confirmDialog({
      message: `Are you sure you want to delete user '${user.username}'?`,
    });
    if (!confirmed) return;
    const { data } = await deleteUser(user.id);
    if (data) {
      this.selection.delete(user.id);
      await this.loadUsers();
      void notify({
        variant: 'success',
        message: `User '${user.username}' has been deleted.`,
      });
    }
  }

  async toggleBlocked(user: DbUser) {
    const confirmed = await confirmDialog({
      message: `Are you sure you want to ${user.blocked ? 'unblock' : 'block'} user '${user.username}'?`,
    });
    if (!confirmed) return;
    const { data } = await updateUser({ id: user.id, blocked: !user.blocked });
    if (data) {
      await this.loadUsers();
      void notify({
        variant: 'warning',
        message: `User '${user.username}' has been ${user.blocked ? 'unblocked' : 'blocked'}.`,
      });
    }
  }

  async impersonateUser(user: DbUser) {
    const confirmed = await confirmDialog({
      message: `Are you sure you want to impersonate user '${user.username}'?`,
    });
    if (!confirmed) return;
    const impersonation = await impersonate(user.username);
    if (impersonation) {
      navigate('/');
      void notify({
        variant: 'warning',
        message: `You are now impersonating user '${user.username}'.`,
        action: {
          label: 'Stop',
          onAction: () => location.reload(),
        },
        duration: 0,
      });
    }
  }

  override render() {
    return html`
      <app-table
        header="Users"
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
          @click=${this.loadUsers}
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
              <th data-action data-frozen>
                <input
                  type="checkbox"
                  @change=${this.toggleSelection}
                  .checked=${this.isAllSelected}
                  .indeterminate=${this.isIndeterminate}
                />
              </th>
              <th data-action data-frozen>Actions</th>
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
              this.users.data,
              (user) => user.id,
              (user) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked=${this.selection.has(user.id)}
                      @change=${(event: Event) => this.toggleSelected(event, user)}
                    />
                  </td>
                  <td>
                    <app-dropdown>
                      <app-button slot="trigger" variant="primary" appearance="plain" size="small">
                        <app-icon filled>more_horiz</app-icon>
                      </app-button>
                      <app-dropdown-item @click=${() => this.openUserDialog(user)}>
                        <app-icon slot="prefix">edit_square</app-icon>
                        Edit
                      </app-dropdown-item>
                      <app-dropdown-item @click=${() => this.toggleBlocked(user)}>
                        <app-icon slot="prefix">block</app-icon>
                        ${user.blocked ? 'Unblock' : 'Block'}
                      </app-dropdown-item>
                      <app-dropdown-item
                        @click=${() => this.impersonateUser(user)}
                        variant="warning"
                        ?disabled=${user.id === this.currentUser?.id}
                        title=${user.id === this.currentUser?.id ? 'Cannot impersonate yourself' : 'Impersonate'}
                      >
                        <app-icon slot="prefix">supervisor_account</app-icon>
                        Impersonate
                      </app-dropdown-item>
                      <app-dropdown-item
                        @click=${() => this.deleteUser(user)}
                        variant="error"
                        ?disabled=${!user.internal}
                        title=${!user.internal ? 'Cannot delete internal user' : 'Delete'}
                      >
                        <app-icon slot="prefix">delete</app-icon>
                        Delete
                      </app-dropdown-item>
                    </app-dropdown>
                  </td>
                  ${this.visibleColumns.map((column) => {
                    const value = user[column.field as keyof DbUser];
                    return html`
                      <td
                        ?data-textlimit=${column.textlimit}
                        title=${ifDefined(column.textlimit ? value : undefined)}
                      >
                        ${column.render ? column.render(user) : value}
                      </td>
                    `;
                  })}
                </tr>
              `,
            )}
            ${when(
              this.users.data.length === 0 && this.loading,
              () => html`
                <tr>
                  <td colspan=${this.visibleColumns.length + 2}>Loading...</td>
                </tr>
              `,
            )}
            ${when(
              this.users.data.length === 0 && !this.loading,
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
          .total=${this.users.total}
        >
        </app-paginator>
      </app-table>

      <app-dialog
        id="user-dialog"
        header="${this.selectedUser ? 'Update' : 'Create'} User"
        modal
        @app-after-close=${() => {
          this.selectedUser = undefined;
          this.userForm.reset();
        }}
      >
        <form @submit=${this.saveUser} novalidate>
          <app-input
            label="Username"
            name="username"
            placeholder="Must be unique"
            required
            ?disabled=${this.selectedUser && !this.selectedUser.internal}
            .value=${this.selectedUser?.username || ''}
          >
          </app-input>
          <app-input
            label="Name"
            placeholder="Full name"
            name="name"
            required
            ?disabled=${this.selectedUser && !this.selectedUser.internal}
            .value=${this.selectedUser?.name || ''}
          >
          </app-input>
          <app-select
            label="Roles"
            name="roles"
            placeholder="Select roles"
            multiple
            required
            .value=${this.selectedUser?.roles?.join(',') || ''}
          >
            <app-option value="admin">Admin</app-option>
            <app-option value="guest">Guest</app-option>
          </app-select>
        </form>
        <app-button slot="footer" variant="primary" appearance="plain" app-dialog-close>
          Cancel
        </app-button>
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

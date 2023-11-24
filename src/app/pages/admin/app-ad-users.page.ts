import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { AppPaginator } from '../../elements/paginator/app-paginator.element'
import { TableColumn } from '../../types/table.type'
import { addSearchParamsToURL, clearSearchParamsFromURL, getURLSearchParamsAsObject } from '../../utils/url'
import { deleteUser, getRoles, getUsers, updateUser, createUserApiKey, deleteUserApiKey, createUser } from '../../services/user.service'
import { when } from 'lit/directives/when.js'
import { appPageTitleStyle } from '../../styles/main.style'
import '../../elements/paginator/app-paginator.element'
import '../../elements/table/app-table.element'
import '../../elements/table/app-table-column-filter.element'
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js'
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import { notify } from '../../shared/notification'
import { SlDialog } from '@shoelace-style/shoelace'
import { confirmDialog } from '../../shared/confirm-dialog'
import { confirmCaptchaDialog } from '../../shared/confirm-captcha-dialog'
import { basicFormStyle, formValidationStyle } from '../../styles/form.style'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { impersonate } from '../../services/auth.service'

import { setDocumentTitle } from '../../utils/html'
import { appTableStyle } from '../../styles/app-table.style'

@customElement('app-ad-users')
export class AppADUsers extends LitElement {
	static styles = [
		appPageTitleStyle,
		appTableStyle,
		formValidationStyle,
		basicFormStyle,
		css``,
	]

	@query('app-paginator')
	paginator!: AppPaginator

	@query('.user-dialog')
	userDialog!: SlDialog

	@query('.user-dialog form')
	userDialogForm!: HTMLFormElement

	#skip = 0

	#limit = 10

	#searchParamsMap = new Map()

	@state()
	loading = false

	@state()
	users = {
		data: [] as any[],
		total: 0,
	}

	@state()
	selectedUser: any = null

	@state()
	roles: string[] = []

	@state()
	columns: TableColumn[] = [
		{ header: 'Name', field: 'name', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Username', field: 'username', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{
			header: 'Roles',
			field: 'roles',
			type: 'select-multiple',
			filtarable: true,
		},
		{
			header: 'Active',
			field: 'active',
			type: 'select',
			sortable: true,
			filtarable: true,
			list: [
				{ label: 'Yes', value: true },
				{ label: 'No', value: false },
			],
		},
		{
			header: 'Blocked',
			field: 'blocked',
			type: 'select',
			sortable: true,
			filtarable: true,
			list: [
				{ label: 'Yes', value: true },
				{ label: 'No', value: false },
			],
		},
		{
			header: 'Internal',
			field: 'internal',
			type: 'select',
			sortable: true,
			filtarable: true,
			list: [
				{ label: 'Yes', value: true },
				{ label: 'No', value: false },
			],
		},
		{ header: 'Created', field: 'created', type: 'date', sortable: true },
		{ header: 'Updated', field: 'updated', type: 'date', sortable: true },
		{ header: 'Last Login', field: 'lastLogin', type: 'date', sortable: true },
	]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Admin - Users')
		this.init()
		this.addEventListener('app-table-column-filter', async (event) => {
			this.#searchParamsMap = (<CustomEvent>event).detail
			addSearchParamsToURL(Object.fromEntries(this.#searchParamsMap))
			this.#skip = 0
			await this.loadUsers()
			this.paginator.reset()
		})
		this.addEventListener('app-paginate', async (event) => {
			const { pageSize, pageIndex } = (<CustomEvent>event).detail
			this.#limit = pageSize
			localStorage.setItem('user-table-limit', this.#limit.toString())
			this.#skip = pageSize * pageIndex
			await this.loadUsers()
		})
		this.addEventListener('app-table-clear', async () => {
			this.#searchParamsMap.clear()
			clearSearchParamsFromURL()
			this.#skip = 0
			this.columns.forEach((column) => {
				column.value = ''
				column.order = null
			})
			await this.loadUsers()
			this.paginator.reset()
		})
	}

	firstUpdated() {
		this.userDialog.addEventListener('sl-request-close', (event) => {
			if (event.detail.source === 'overlay') {
				event.preventDefault()
			}
		})
		this.userDialog.addEventListener('sl-after-hide', (event) => {
			if (event.target === this.userDialog) {
				this.selectedUser = null
				this.userDialogForm.reset()
			}
		})
		this.userDialogForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			const data: any = serialize(this.userDialogForm)
			data.active = data.active === 'on' ? true : false
			data.blocked = data.blocked === 'on' ? true : false
			let res = null
			if (this.selectedUser?.id) {
				res = await updateUser({ id: this.selectedUser.id, ...data })
			} else {
				res = await createUser(data)
			}
			if (res.data) {
				this.userDialog.hide()
				await this.loadUsers()
				notify({ variant: 'success', message: res.message })
			}
		})
	}

	async init() {
		this.#searchParamsMap = new Map(Object.entries(getURLSearchParamsAsObject()))
		this.#limit = Number(localStorage.getItem('user-table-limit')) || this.#limit
		this.#searchParamsMap.forEach((value, key) => {
			const column = this.columns.find((column) => column.field === key)
			if (column) {
				column.value = value
			}
		})
		const sortColumn = this.columns.find((column) => column.field === this.#searchParamsMap.get('sort'))
		if (sortColumn) {
			sortColumn.order = this.#searchParamsMap.get('order')
		}
		await this.loadUsers()
		this.roles = await getRoles()
		const rolesColumn = this.columns.find((column) => column.field === 'roles')
		if (rolesColumn) {
			rolesColumn.list = this.roles.map((role: string) => {
				return {
					label: role,
					value: role,
				}
			})
		}
	}

	async loadUsers() {
		this.loading = true
		this.users = await getUsers({ skip: this.#skip, limit: this.#limit, ...Object.fromEntries(this.#searchParamsMap) })
		this.loading = false
	}

	async blockUser(user: any) {
		const res = await updateUser({ id: user.id, blocked: true })
		if (res.data) {
			await this.loadUsers()
			notify({ variant: 'success', message: res.message })
		}
	}

	async unblockUser(user: any) {
		const res = await updateUser({ id: user.id, blocked: false })
		if (res.data) {
			await this.loadUsers()
			notify({ variant: 'success', message: res.message })
		}
	}

	async removeUser(user: any) {
		const confirm = await confirmCaptchaDialog('Confirm', `Are you sure you want to delete user '${user.name}'?`)
		if (!confirm) return
		const res = await deleteUser(user.id)
		if (res.data) {
			await this.loadUsers()
			notify({ variant: 'success', message: res.message })
		}
	}

	async createApiKey(user: any) {
		const res = await createUserApiKey(user.id)
		if (res.data) {
			await this.loadUsers()
			notify({ variant: 'success', message: res.message })
		}
	}

	async deleteApiKey(user: any) {
		const confirm = await confirmDialog('Confirm', `Are you sure you want to delete api key for user '${user.name}'?`)
		if (!confirm) return
		const res = await deleteUserApiKey(user.id)
		if (res.data) {
			await this.loadUsers()
			notify({ variant: 'success', message: res.message })
		}
	}

	async openUserDialog(user?: any) {
		this.selectedUser = user ? structuredClone(user) : null
		this.userDialog.show()
	}

	async impersonateUser(user: any) {
		const req = await impersonate(user.username)
		if (req) {
			Router.go('/')
		}
	}

	render() {
		return html`
			<h3 class="title">Users</h3>
			<app-table searchable clearable .searchValue=${this.#searchParamsMap.get('search')} .searchParamsMap=${this.#searchParamsMap}>
				<sl-button slot="actions" pill variant="primary" @click=${() => this.openUserDialog()}>
					<sl-icon slot="prefix" name="plus"></sl-icon>
					Create user
				</sl-button>
				<table slot="table">
					<thead>
						<tr>
							<th action sticky></th>
							${this.columns.map((column) => html`
								<th>
									<app-table-column-filter
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
									</app-table-column-filter>
								</th>
							`)}
						</tr>
					</thead>
					<tbody>
						${this.users.data.map((user) => html`
							<tr>
								<td sticky>
									<sl-dropdown hoist>
										<sl-icon-button slot="trigger" name="three-dots" label="Actions" title="Actions"></sl-icon-button>
										<sl-menu>
											<sl-menu-item @click=${() => this.openUserDialog(user)}>Edit</sl-menu-item>
											${when(
												user.apiKey,
												() =>
													html`
														<sl-menu-item @click=${() => navigator.clipboard.writeText(user.apiKey.jwt)}>
															Copy API key
														</sl-menu-item>
													`
											)}
											${when(
												!user.blocked,
												() => html`<sl-menu-item @click=${() => this.impersonateUser(user)}>Impersonate</sl-menu-item>`
											)}
											<sl-divider></sl-divider>
											${when(
												user.apiKey,
												() => html`<sl-menu-item @click=${() => this.deleteApiKey(user)}>Delete API key</sl-menu-item>`,
												() => html`<sl-menu-item @click=${() => this.createApiKey(user)}>Create API key</sl-menu-item>`
											)}
											${when(
												user.blocked,
												() => html`<sl-menu-item @click=${() => this.unblockUser(user)}>Unblock</sl-menu-item>`,
												() => html`<sl-menu-item @click=${() => this.blockUser(user)}>Block</sl-menu-item>`
											)}
											<sl-menu-item @click=${() => this.removeUser(user)}>Delete</sl-menu-item>
										</sl-menu>
									</sl-dropdown>
								</td>
								<td textlimit>${user.name}</td>
								<td textlimit>${user.username}</td>
								<td>${user.roles.toString()}</td>
								<td>${user.active ? 'Yes' : 'No'}</td>
								<td>${user.blocked ? 'Yes' : 'No'}</td>
								<td>${user.internal ? 'Yes' : 'No'}</td>
								<td>
									<sl-format-date
										month="long"
										day="numeric"
										year="numeric"
										hour="numeric"
										minute="numeric"
										.date=${user.created || ''}
									></sl-format-date>
								</td>
								<td>
									<sl-format-date
										month="long"
										day="numeric"
										year="numeric"
										hour="numeric"
										minute="numeric"
										.date=${user.updated || ''}
									></sl-format-date>
								</td>
								<td>
									<sl-relative-time .date=${user.lastLogin || ''}></sl-relative-time>
								</td>
							</tr>
						`)}
						${when(
							this.users.data.length === 0 && this.loading,
							() => html`
								<tr>
									<td colspan=${this.columns.length}>Loading...</td>
								</tr>
							`
						)}
						${when(
							this.users.data.length === 0 && !this.loading,
							() => html`
								<tr>
									<td colspan=${this.columns.length}>No results found</td>
								</tr>
							`
						)}
					</tbody>
				</table>
				<app-paginator slot="paginator" .pageSize=${this.#limit} .pageSizeOptions=${[5, 10, 15]} .total=${this.users.total}></app-paginator>
			</app-table>
			
			<sl-dialog label="${this.selectedUser ? 'Edit' : 'Create'} user ${this.selectedUser?.name}"  class="user-dialog">
				<form class="basic-form form-validation">
					<sl-input
						.value=${this.selectedUser?.name || ''}
						name="name"
						autocomplete="off"
						label="Name"
						placeholder="User name"
						clearable
						required
						?disabled=${this.selectedUser?.internal === false}
					></sl-input>
					<sl-input
						.value=${this.selectedUser?.username || ''}
						name="username"
						autocomplete="off"
						label="Username"
						placeholder="Username"
						clearable
						required
						?disabled=${this.selectedUser?.internal === false}
					></sl-input>
					<sl-select
						.value=${this.selectedUser?.roles || []}
						hoist
						clearable
						multiple
						label="Roles"
						.maxOptionsVisible=${3}
						name="roles"
						placeholder="Select roles"
					>
						${this.roles.map((role: string) => html`<sl-option value=${role}>${role}</sl-option>`)}
					</sl-select>
					<sl-checkbox ?checked=${this.selectedUser?.active ?? true} name="active">Active</sl-checkbox>
					<sl-checkbox ?checked=${this.selectedUser?.blocked ?? false} name="blocked">Blocked</sl-checkbox>
					<div class="form-actions">
						<sl-button type="submit" variant="primary">${this.selectedUser ? 'Save' : 'Create'}</sl-button>
					</div>
				</form>
			</sl-dialog>
		`
	}
}

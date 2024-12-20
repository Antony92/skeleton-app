import { getUsers } from '@app/services/api.service'
import { tableStyle } from '@app/styles/table.style'
import { PaginatedResponse } from '@app/types/response.type'
import { setDocumentTitle } from '@app/utils/html'
import { addSearchParamsToURL, clearSearchParamsFromURL, getURLSearchParamsAsMap } from '@app/utils/url'
import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@app/elements/table/app-table.element'
import '@app/elements/paginator/app-paginator.element'
import { TableColumn } from '@app/types/table.type'
import { when } from 'lit/directives/when.js'
import { AppPaginator } from '@app/elements/paginator/app-paginator.element'
import { AppPaginateEvent } from '@app/events/pagination.event'
import { AppTableFilterEvent } from '@app/events/table.event'

@customElement('app-table-page')
export class AppTablePage extends LitElement {
	static styles = [tableStyle, css``]

	@state()
	accessor users: PaginatedResponse<any> = {
		data: [],
		total: 0,
	}

	@state()
	accessor loading = true

	@query('app-paginator')
	accessor paginator!: AppPaginator

	private searchParamsMap = new Map()
	private skip = 0
	private limit = 10
	private storageLimitName = 'table-limit'
	private columns: TableColumn[] = [
		{ header: '#', field: 'id', type: 'number', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Username', field: 'username', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'First Name', field: 'firstName', type: 'text', sortable: true, filtarable: true, delay: 300 },
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
	]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Table')
		this.limit = Number(localStorage.getItem(this.storageLimitName)) || this.limit
		this.searchParamsMap = getURLSearchParamsAsMap()
		this.columns
			.filter((column) => this.searchParamsMap.has(column.field))
			.forEach((column) => {
				column.value = this.searchParamsMap.get(column.field)
				if (column.field === this.searchParamsMap.get('sort')) {
					column.order = this.searchParamsMap.get('order')
				}
			})
		this.loadUsers()
	}

	protected firstUpdated(): void {}

	async loadUsers() {
		this.loading = true
		this.users = await getUsers({ skip: this.skip, limit: this.limit, ...Object.fromEntries(this.searchParamsMap) })
		this.loading = false
	}

	onPaginate(event: AppPaginateEvent) {
		const { pageSize, pageIndex } = event.value
		this.limit = pageSize
		localStorage.setItem(this.storageLimitName, this.limit.toString())
		this.skip = pageSize * pageIndex
		this.loadUsers()
	}

	async onTableFilter(event: AppTableFilterEvent) {
		this.searchParamsMap = event.filters
		addSearchParamsToURL(Object.fromEntries(this.searchParamsMap))
		this.skip = 0
		await this.loadUsers()
		this.paginator.reset()
	}

	async onTableClear() {
		this.searchParamsMap.clear()
		clearSearchParamsFromURL()
		this.skip = 0
		this.columns.forEach((column) => {
			column.value = ''
			column.order = null
		})
		await this.loadUsers()
		this.paginator.reset()
	}

	render() {
		return html`
			<app-table searchable clearable @app-table-clear=${this.onTableClear} @app-table-filter=${this.onTableFilter}>
				<table slot="table">
					<thead>
						<tr>
							<th action sticky></th>
							${this.columns.map((column) => html` <th>${column.header}</th> `)}
						</tr>
					</thead>
					<tbody>
						${this.users.data.map(
							(user) => html`
								<tr>
									<td sticky>action</td>
									<td>${user.id}</td>
									<td>${user.username}</td>
									<td>${user.firstName}</td>
									<td>${user.lastName}</td>
									<td>${user.email}</td>
									<td textlimit title=${user.userAgent}>${user.userAgent}</td>
									<td>${user.role}</td>
								</tr>
							`
						)}
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
				<app-paginator
					slot="paginator"
					@app-paginate=${this.onPaginate}
					.pageSize=${this.limit}
					.pageSizeOptions=${[5, 10, 15]}
					.total=${this.users.total}
				>
				</app-paginator>
			</app-table>
		`
	}
}

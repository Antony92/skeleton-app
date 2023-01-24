import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '../elements/paginator/app-paginator.element'
import '../elements/table/app-table.element'
import '../elements/table/app-table-head.element'
import '../elements/table/app-table-heading.element'
import '../elements/table/app-table-body.element'
import '../elements/table/app-table-row.element'
import '../elements/table/app-table-cell.element'
import { TableColumn } from '../types/table.type'
import { getUsers } from '../services/api.service'
import { SearchQuery } from '../types/search.type'
import { AppPaginator } from '../elements/paginator/app-paginator.element'
import { when } from 'lit/directives/when.js'
import { confirmDialog } from '../services/confirm-dialog.service'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = css``

	@query('app-paginator')
	paginator!: AppPaginator

	#skip = 0

	#limit = 10

	#searchQuery = {}

	@state()
	loading = false

	@state()
	users = {
		data: [] as any[],
		total: 0
	}

	@state()
	columns: TableColumn[] = [
		{ header: 'Name', field: 'name', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Username', field: 'username', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Email', field: 'email', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Website', field: 'website', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{
			header: 'City',
			field: 'address.city',
			type: 'select',
			sortable: true,
			filtarable: true,
			values: [
				{ label: 'Gwenborough', value: 'Gwenborough' },
				{ label: 'Wisokyburgh', value: 'Wisokyburgh' },
				{ label: 'McKenziehaven', value: 'McKenziehaven' },
			],
		},
	]

	override connectedCallback() {
		super.connectedCallback()
		this.loadUsers({ skip: this.#skip, limit: this.#limit })
		this.addEventListener('app-table-filter', async (event) => {
			this.#searchQuery = (<CustomEvent>event).detail
			this.#skip = 0
			await this.loadUsers({ skip: this.#skip, limit: this.#limit, ...this.#searchQuery })
			this.paginator.reset()
		})
		this.addEventListener('app-paginate', (event) => {
			const { pageSize, pageIndex } = (<CustomEvent>event).detail
            this.#limit = pageSize
            this.#skip = pageSize * pageIndex
			this.loadUsers({ skip: this.#skip, limit: this.#limit, ...this.#searchQuery })
		})
		this.addEventListener('app-table-clear', async (event) => {
			this.#searchQuery = {}
			this.#skip = 0
			await this.loadUsers({ skip: this.#skip, limit: this.#limit })
			this.paginator.reset()
		})
	}

	async loadUsers(query: SearchQuery) {
		this.loading = true
		this.users = await getUsers(query)
		this.loading = false
	}

	override render() {
		return html`
			<app-table searchable clearable ?loading=${this.loading}>
				<app-table-head slot="head">
					${this.columns.map((column) => html`
						<app-table-heading 
							?sortable=${column.sortable}
							?filterable=${column.filtarable}
							.label=${column.header}
							.field=${column.field}
							.type=${column.type}
							.delay=${column.delay}
							.values=${column.values}
						>
							${column.header}
						</app-table-heading>
					`)}
				</app-table-head>
				<app-table-body slot="body">
					${this.users.data.map(user => html`
						<app-table-row>
							<app-table-cell>${user.name}</app-table-cell>
							<app-table-cell>${user.username}</app-table-cell>
							<app-table-cell>${user.email}</app-table-cell>
							<app-table-cell>${user.website}</app-table-cell>
							<app-table-cell>${user.address.city}</app-table-cell>
						</app-table-row>
					`)}
					${when(this.users.data.length === 0 && !this.loading, () => html`
						<app-table-row>
							<app-table-cell>No results found</app-table-cell>
						</app-table-row>
					`)}
				</app-table-body>
				
				<app-paginator slot="paginator" pageSize="10" .pageSizeOptions=${[5, 10, 15]} length=${this.users.total}></app-paginator>
			</app-table>
		`
	}
}

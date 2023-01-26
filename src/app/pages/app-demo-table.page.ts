import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
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
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'

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
			list: [
				{ label: 'Gwenborough', value: 'Gwenborough' },
				{ label: 'Wisokyburgh', value: 'Wisokyburgh' },
				{ label: 'McKenziehaven', value: 'McKenziehaven' },
			],
		},
	]

	connectedCallback() {
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
		this.users.data.forEach(user => {
			user.checked = false
		})
		this.loading = false
	}

	toggleAllSelection(event: CustomEvent) {
		const checkbox = <SlCheckbox>event.target
		this.users.data.forEach(user => {
			user.checked = checkbox.checked
		})
		this.requestUpdate()
	}

	toggleSingleSelection(event: CustomEvent, user: any) {
		user.checked = (<SlCheckbox>event.target).checked
		this.requestUpdate()
	}

	isIndeterminate() {
		const allChecked = this.users.data.filter(user => user).every(user => user.checked)
		const someChecked = this.users.data.some(user => user.checked)
		return !allChecked && someChecked
	}

	isChecked() {
		return this.users.data.filter(user => user).every(user => user.checked)
	}

	render() {
		return html`
			<app-table searchable clearable ?loading=${this.loading}>
				<app-table-head>
					<app-table-heading>
						<sl-checkbox 
							?indeterminate=${this.isIndeterminate()}
							?checked=${this.isChecked()}
							@sl-change=${this.toggleAllSelection}>
						</sl-checkbox>
					</app-table-heading>
					${this.columns.map((column) => html`
						<app-table-heading 
							?sortable=${column.sortable}
							?filterable=${column.filtarable}
							.label=${column.header}
							.field=${column.field}
							.type=${column.type}
							.delay=${column.delay}
							.list=${column.list}
						>
							${column.header}
						</app-table-heading>
					`)}
				</app-table-head>
				<app-table-body>
					${this.users.data.map(user => html`
						<app-table-row>
							<app-table-cell>
								<sl-checkbox 
								?checked=${user.checked} 
								@sl-change=${(event: CustomEvent) => this.toggleSingleSelection(event, user)}>
							</sl-checkbox>
							</app-table-cell>
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
				
				<app-paginator slot="paginator" .pageSize=${10} .pageSizeOptions=${[5, 10, 15]} length=${this.users.total}></app-paginator>
			</app-table>
		`
	}
}

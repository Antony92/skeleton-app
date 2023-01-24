import { html, LitElement, css, PropertyValueMap } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../elements/app-paginator.element'
import '../elements/table/app-table.element'
import '../elements/table/app-table-head.element'
import '../elements/table/app-table-heading.element'
import '../elements/table/app-table-body.element'
import '../elements/table/app-table-row.element'
import '../elements/table/app-table-cell.element'
import { TableColumn } from '../types/table.type'
import { getUsers } from '../services/api.service'
import { SearchQuery } from '../types/search.type'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = css``

	@state()
	loading = false

	@state()
	users = {
		data: [] as any[],
		total: 0
	}

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
		this.loadUsers({ skip: 0, limit: 10 })
		this.addEventListener('app-table-load', (event) => {
			const query = (<CustomEvent>event).detail
			this.loadUsers(query)
		})
	}

	private async loadUsers(query: SearchQuery) {
		this.loading = true
		this.users = await getUsers(query)
		this.loading = false
	}

	override render() {
		return html`
			<app-table searchable clearable ?loading=${this.loading} .data=${this.users.data}>
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
				</app-table-body>
				
				<app-paginator slot="paginator" pageSize="10" .pageSizeOptions=${[5, 10, 15]} length=${this.users.total}></app-paginator>
			</app-table>
		`
	}
}

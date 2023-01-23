import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../elements/table/app-table.element'
import '../elements/table/app-table-head.element'
import '../elements/table/app-table-heading.element'
import '../elements/table/app-table-body.element'
import '../elements/table/app-table-row.element'
import '../elements/table/app-table-cell.element'
import '../elements/table/app-table-old.element'
import '../elements/app-paginator.element'
import { TableColumn } from '../types/table.type'
import { SearchQuery } from '../types/search.type'
import { getUsers } from '../services/api.service'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = css``

	@state()
	users = {
		data: [] as any[],
		total: 0
	}

	columns: TableColumn[] = [
		{ header: 'Name', field: 'name', type: 'text' },
		{ header: 'Username', field: 'username', type: 'text'},
		{ header: 'Email', field: 'email', type: 'text' },
		{ header: 'Website', field: 'website', type: 'text' },
		{
			header: 'City',
			field: 'address.city',
			type: 'select',
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
	}

	override firstUpdated() {
		this.renderRoot.querySelector('app-table')?.addEventListener('app-table-load', (event) => console.log(event))
	}

	private async loadUsers(query: SearchQuery) {
		this.users = await getUsers(query)
	}

	override render() {
		return html`
			<app-table searchable clearable .data=${this.users.data}>
				<app-table-head slot="head">
					${this.columns.map((column) => html`
						<app-table-heading 
							sortable
							filterable
							.label=${column.header}
							.field=${column.field}
							.type=${column.type}
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

			<!-- <app-table-old></app-table-old> -->
		`	
	}
}

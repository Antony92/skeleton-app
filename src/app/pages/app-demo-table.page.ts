import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '../elements/app-paginator.element'


@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = css`
		table {
			width: 100%;
			border-collapse: collapse;
			table-layout: fixed;
		}

		table thead th,
		table tbody td {
			text-align: left;
			border-bottom: 1px solid grey;
			padding: 10px;
		}
	`

	@query('app-paginator') 
    paginator!: HTMLElementTagNameMap['app-paginator']

	@state()
	private data: any = null

	private columns = ['Id', 'Email', 'Username', 'Address', 'IP']

	override connectedCallback() {
		super.connectedCallback()
		this.loadUsers()
	}

	protected override firstUpdated() {
		this.paginator.addEventListener('app-paginate', async (event) => {
            const { pageSize, pageIndex } = (event as CustomEvent).detail
            await this.loadUsers(pageSize * pageIndex, pageSize)
        })
	}

	private async loadUsers(skip = 0, limit = 10) {
		this.data = await getUsers(skip, limit)
	}

	override render() {
		return html`
			<table>
				<thead>
					<tr>
						${this.columns.map((column) => html`<th>${column}</th>`)}
					</tr>
				</thead>
				<tbody>
				${when(this.data?.users?.length > 0, 
					() => html`
						${this.data?.users?.map(
							(user: any) => html`
								<tr>
									<td>${user.id}</td>
									<td>${user.email}</td>
									<td>${user.username}</td>
									<td>${user.address.address}</td>
									<td>${user.ip}</td>
								</tr>
							`
						)}
					`, 
					() => html`
						<tr>
							<td colspan=${this.columns.length}>
								No results found
							</td>
						</tr>
					`
				)} 
				</tbody>
				<tfoot>
					<tr>
						<td colspan=${this.columns.length}>
							<app-paginator pageSize="10" .pageSizeOptions=${[5,10,15]} length=${this.data?.total}></app-paginator>
						</td>
					</tr>
				</tfoot>
			</table>
		`
	}
}

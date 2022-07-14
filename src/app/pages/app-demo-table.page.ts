import { html, LitElement, css, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '../elements/app-paginator.element'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = css`
		table {
			width: 800px;
			border-collapse: collapse;
		}

		table thead th,
		table tbody td {
			text-align: left;
			border-bottom: 1px solid grey;
		}

		table th,
		table td {
			padding: 10px;
		}

		table tbody tr:hover {
			background-color: dimgrey;
		}
	`

	@query('app-paginator') 
    paginator!: HTMLElementTagNameMap['app-paginator']

	@state()
	private users: any = null

	private columns = ['Id', 'Email', 'Username', 'Address', 'IP']

	override connectedCallback() {
		super.connectedCallback()
		this.loadUsers(0, 5)
	}

	protected override firstUpdated() {
		this.paginator.addEventListener('app-paginate', async (event) => {
            const { skip, limit } = (event as CustomEvent).detail
            await this.loadUsers(skip, limit)
        })
	}

	async loadUsers(skip = 0, limit = 10) {
		this.users = await getUsers(skip, limit)
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
					${this.users?.users?.map(
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
				</tbody>
				<tfoot>
					<tr>
						<td colspan="${this.columns.length}">
							<app-paginator limit="5" itemsPerPageOptions="[5, 10, 15]" length=${this.users?.total}></app-paginator>
						</td>
					</tr>
				</tfoot>
			</table>
		`
	}
}

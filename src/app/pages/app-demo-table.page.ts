import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '../elements/app-paginator.element'
import { debounceTime, Subject } from 'rxjs'


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

		table tbody td {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	`

	@state()
	private data: any = null

	private $filterEvent = new Subject<{ field: string, value: string }>()

	private filter: { [key: string]: string } = {}

	private columns = [
		{ header: 'Id', field: 'id' },
		{ header: 'Email', field: 'email' },
		{ header: 'Username', field: 'username' },
		{ header: 'User agent', field: 'userAgent' },
		{ header: 'IP', field: 'ip' },
	]

	override connectedCallback() {
		super.connectedCallback()
		this.loadUsers()
		this.$filterEvent
			.asObservable()
			.pipe(debounceTime(300))
			.subscribe(column => {
				this.filter[column.field] = column.value
				console.log(this.filter)
			})
	}

	private async loadUsers(skip = 0, limit = 10) {
		this.data = await getUsers(skip, limit)
	}

	async page(event: CustomEvent) {
		const { pageSize, pageIndex } = event.detail
		await this.loadUsers(pageSize * pageIndex, pageSize)
	}

	filterTable(event: Event, field: string) {
		const input = (event.target as HTMLInputElement)
		this.$filterEvent.next({ field, value: input.value })
	}

	override render() {
		return html`
			<table>
				<thead>
					<tr>
						${this.columns.map((column) => html`
							<th>
								${column.header} <br/>
								<sl-input 
									clearable 
									@sl-input=${(event: Event) => this.filterTable(event, column.field)} 
									placeholder="Filter by ${column.header}"
								>
								</sl-input>
							</th>
						`)}
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
									<td>${user.userAgent}</td>
									<td>${user.ip}</td>
								</tr>
							`
						)}
					`, 
					() => html`
						<tr>
							<td colspan=${this.columns.length}>
								${!this.data ? 'Loading...' : 'No results found'}
							</td>
						</tr>
					`
				)} 
				</tbody>
				<tfoot>
					<tr>
						<td colspan=${this.columns.length}>
							<app-paginator 
								@app-paginate=${(event: CustomEvent) => this.page(event)} 
								pageSize="10" 
								.pageSizeOptions=${[5,10,15]} 
								length=${this.data?.total}>
							</app-paginator>
						</td>
					</tr>
				</tfoot>
			</table>
		`
	}
}

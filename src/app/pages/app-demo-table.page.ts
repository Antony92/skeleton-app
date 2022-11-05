import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
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

		table thead th.sortable {
			cursor: pointer;
		}

		table thead th.sortable sl-icon {
			position: relative;
    		top: 3px;
		}
	`

	@state()
	private data: any = null

	private $filterEvent = new Subject<{ field: string, value: string }>()

	private filter: { [key: string]: string } = {}

	private columns = [
		{ header: 'Id', field: 'id', sort: 0 },
		{ header: 'Email', field: 'email', sort: 0 },
		{ header: 'Username', field: 'username', sort: 0 },
		{ header: 'User agent', field: 'userAgent', sort: 0 },
		{ header: 'IP', field: 'ip', sort: 0 },
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

	filterEvent(event: Event, field: string) {
		const input = (event.target as HTMLInputElement)
		this.$filterEvent.next({ field, value: input.value })
	}

	async sortEvent(column: { field: string, sort: number }) {
		this.columns
			.filter(col => col.field !== column.field)
			.forEach(col => col.sort = 0)

		if (column.sort === 0) {
			column.sort = 1
		} else if (column.sort === 1) {
			column.sort = -1
		} else if (column.sort === -1) {
			column.sort = 0
		}

		this.requestUpdate()

		console.log({ field: column.field, sort: column.sort })
	}

	override render() {
		return html`
			<table>
				<thead>
					<tr>
						${this.columns.map((column) => html`
							<th class="sortable" @click=${() => this.sortEvent(column)}>
								${column.header}
								${when(column.sort === 1, () => html`<sl-icon name="sort-up"></sl-icon>`)}
								${when(column.sort === -1, () => html`<sl-icon name="sort-down"></sl-icon>`)}
							</th>
						`)}
					</tr>
					<tr>
						${this.columns.map((column) => html`
							<th>
								<sl-input 
									clearable 
									@sl-input=${(event: Event) => this.filterEvent(event, column.field)} 
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

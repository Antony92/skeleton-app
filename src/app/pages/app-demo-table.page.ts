import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '../elements/app-paginator.element'
import { debounce, Subject, timer } from 'rxjs'


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

	private $filterEvent = new Subject<{ column: Column, value: string}>()

	private filter: { [key: string]: string | number } = {}

	private columns: Column[] = [
		{ header: 'Id', field: 'id', type: 'number' },
		{ header: 'Email', field: 'email', type: 'text' },
		{ header: 'Username', field: 'username', type: 'text' },
		{ header: 'User agent', field: 'userAgent', type: 'select' },
		{ header: 'IP', field: 'ip', type: 'date' },
	]

	override connectedCallback() {
		super.connectedCallback()
		this.loadUsers()
		this.$filterEvent
			.asObservable()
			.pipe(debounce(event => ['number', 'text'].includes(event.column.type) ? timer(300) : timer(0)))
			.subscribe(event => {
				this.filter[event.column.field] = event.value
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

	filterEvent(column: Column, value: string) {
		this.$filterEvent.next({ column, value })
	}

	async sortEvent(column: Column) {
		this.columns
			.filter(col => col.field !== column.field)
			.forEach(col => col.sort = 0)

		if (!column.sort) {
			column.sort = 1
		} else if (column.sort === 1) {
			column.sort = -1
		} else if (column.sort === -1) {
			column.sort = 0
		}

		this.requestUpdate()

		if (column.sort !== 0) {
			this.filter.sortOrder = column.sort
			this.filter.sortField = column.field
		} else {
			delete this.filter.sortOrder
			delete this.filter.sortField
		}

		console.log(this.filter)
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
								${when(column.type === 'text', () => html`
									<sl-input 
										clearable
										type="text"
										placeholder="Filter by ${column.header}"
										@sl-input=${(event: Event) => this.filterEvent(column, (event.target as HTMLInputElement).value)} 
									>
									</sl-input>
								`)}
								${when(column.type === 'number', () => html`
									<sl-input 
										clearable
										type="number" 
										placeholder="Filter by ${column.header}"
										@sl-input=${(event: Event) => this.filterEvent(column, (event.target as HTMLInputElement).value)} 
									>
									</sl-input>
								`)}
								${when(column.type === 'date', () => html`
									<sl-input 
										clearable
										type="date"
										placeholder="Filter by ${column.header}"
										@sl-input=${(event: Event) => this.filterEvent(column, (event.target as HTMLInputElement).value)} 
									>
									</sl-input>
								`)}
								${when(column.type === 'select', () => html`
									<sl-select 
										clearable 
										placeholder="Filter by ${column.header}"
										@sl-change=${(event: CustomEvent) => this.filterEvent(column, (event.target as HTMLElementTagNameMap['sl-select']).value as string)}>

										<sl-menu-item value="option-1">Option 1</sl-menu-item>
										<sl-menu-item value="option-2">Option 2</sl-menu-item>
										<sl-menu-item value="option-3">Option 3</sl-menu-item>
									</sl-select>
								`)}
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

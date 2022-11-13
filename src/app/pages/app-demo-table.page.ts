import { html, LitElement, css } from 'lit'
import { customElement, query, queryAll, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '../elements/app-paginator.element'
import { debounce, Subject, timer, Subscription, filter } from 'rxjs'

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

		.search-box {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
		}

		.search-box sl-input {
			min-width: 500px;
		}
	`

	@state()
	private data: any = null

	@query('app-paginator') paginator!: HTMLElementTagNameMap['app-paginator']
	@queryAll('sl-input') inputs!: NodeListOf<HTMLElementTagNameMap['sl-input']>
	@queryAll('sl-select') selects!: NodeListOf<HTMLElementTagNameMap['sl-select']>

	private searchQuery: SearchQuery = {}
	private skip = 0
	private limit = 10

	private $filterEvent = new Subject<FilterTableEvent>()

	private filterSubscription: Subscription | null = null

	private filtersApplied = false
	private clearingFilters = false

	private columns: TableColumn[] = [
		{ header: 'Id', field: 'id', type: 'number' },
		{ header: 'Name', field: 'name', type: 'string' },
		{ header: 'Username', field: 'username', type: 'string' },
		{ header: 'Email', field: 'email', type: 'string' },
		{ header: 'Website', field: 'website', type: 'string' },
		{ header: 'City', field: 'city', type: 'select' },
	]

	override connectedCallback() {
		super.connectedCallback()
		this.loadUsers()
		this.filterSubscription = this.$filterEvent
			.asObservable()
			.pipe(
				filter(() => !this.clearingFilters),
				debounce((event) => (event.delay ? timer(event.delay) : timer(0))),
			)
			.subscribe((event) => {
				const value = event.value?.toString()
				if (value) {
					this.searchQuery[event.field] = value
				} else {
					delete this.searchQuery[event.field]
				}
				this.filtersApplied = Object.keys(this.searchQuery).length > 0
				this.loadUsers(true)
			})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.filterSubscription?.unsubscribe()
	}

	private async loadUsers(reset = false) {
		console.log('search query: ', this.searchQuery)
		if (reset) {
			this.skip = 0
			this.data = await getUsers(this.skip, this.limit, this.searchQuery)
			this.paginator.pageIndex = 0
		} else {
			this.data = await getUsers(this.skip, this.limit, this.searchQuery)
		}	
	}

	private page(event: CustomEvent) {
		const { pageSize, pageIndex } = event.detail
		this.limit = pageSize
		this.skip = pageSize * pageIndex
		this.loadUsers()
	}

	private filter(event: FilterTableEvent) {
		this.$filterEvent.next(event)
	}

	private sort(column: TableColumn) {
		this.columns.filter((col) => col.field !== column.field).forEach((col) => (col.sort = null))

		if (!column.sort) {
			column.sort = 1
		} else if (column.sort === 1) {
			column.sort = -1
		} else if (column.sort === -1) {
			column.sort = null
		}

		this.requestUpdate()

		if (column.sort) {
			this.searchQuery.sortOrder = column.sort
			this.searchQuery.sortField = column.field
		} else {
			delete this.searchQuery.sortOrder
			delete this.searchQuery.sortField
		}

		this.filtersApplied = Object.keys(this.searchQuery).length > 0

		this.loadUsers()
	}

	private async clearFilters() {
		this.clearingFilters = true
		this.filtersApplied = false

		this.searchQuery = {}
		this.columns.forEach((col) => (col.sort = null))
		this.inputs.forEach((input) => (input.value = ''))
		this.selects.forEach((select) => (select.value = select.multiple ? [] : ''))

		setTimeout(() => this.clearingFilters = false, 0)
		
		await this.loadUsers(true)

	}

	override render() {
		return html`
			<div class="search-box">
				<sl-input 
					clearable 
					type="search" 
					placeholder="Search" 
					@sl-input=${(event: Event) => this.filter({ delay: 300, field: 'search', value: (event.target as HTMLInputElement).value})}>
					<sl-icon name="search" slot="prefix"></sl-icon>
				</sl-input>

				<sl-button variant="default" pill @click=${this.clearFilters} ?disabled=${!this.filtersApplied}>
					<sl-icon slot="prefix" name="funnel"></sl-icon>
					Clear filters
				</sl-button>
			</div>
			
			<table>
				<thead>
					<tr>
						${this.columns.map(
							(column) => html`
								<th class="sortable" @click=${() => this.sort(column)}>
									${column.header} 
									${when(column.sort === 1, () => html`<sl-icon name="sort-up"></sl-icon>`)}
									${when(column.sort === -1, () => html`<sl-icon name="sort-down"></sl-icon>`)}
								</th>
							`
						)}
					</tr>
					<tr>
						${this.columns.map(
							(column) => html`
								<th>
									${when(
										column.type === 'string',
										() => html`
											<sl-input
												clearable
												type="text"
												placeholder="Filter by ${column.header}"
												@sl-input=${(event: Event) =>
													this.filter({ delay: 300, field: column.field, value: (event.target as HTMLInputElement).value })}
											>
											</sl-input>
										`
									)}
									${when(
										column.type === 'number',
										() => html`
											<sl-input
												clearable
												type="number"
												placeholder="Filter by ${column.header}"
												@sl-input=${(event: Event) =>
													this.filter({ delay: 300, field: column.field, value: (event.target as HTMLInputElement).value })}
											>
											</sl-input>
										`
									)}
									${when(
										column.type === 'date',
										() => html`
											<sl-input
												clearable
												type="date"
												placeholder="Filter by ${column.header}"
												@sl-input=${(event: Event) =>
													this.filter({ field: column.field, value: (event.target as HTMLInputElement).value })}
											>
											</sl-input>
										`
									)}
									${when(
										column.type === 'select',
										() => html`
											<sl-select
												clearable
												placeholder="Filter by ${column.header}"
												@sl-change=${(event: CustomEvent) =>
													this.filter({ field: column.field, value: (event.target as HTMLElementTagNameMap['sl-select']).value })}
											>
												<sl-menu-item value="Aliyaview">Aliyaview</sl-menu-item>
												<sl-menu-item value="Howemouth">Howemouth</sl-menu-item>
												<sl-menu-item value="Gwenborough">Gwenborough</sl-menu-item>
											</sl-select>
										`
									)}
								</th>
							`
						)}
					</tr>
				</thead>
				<tbody>
					${when(
						this.data?.users?.length > 0,
						() => html`
							${this.data?.users?.map(
								(user: any) => html`
									<tr>
										<td>${user.id}</td>
										<td>${user.name}</td>
										<td>${user.username}</td>
										<td>${user.email}</td>
										<td>${user.website}</td>
										<td>${user.address.city}</td>
									</tr>
								`
							)}
						`,
						() => html`
							<tr>
								<td colspan=${this.columns.length}>${!this.data ? 'Loading...' : 'No results found'}</td>
							</tr>
						`
					)}
				</tbody>
				<tfoot>
					<tr>
						<td colspan=${this.columns.length}>
							<app-paginator
								@app-paginate=${this.page}
								pageSize="10"
								.pageSizeOptions=${[5, 10, 15]}
								length=${this.data?.total}
							>
							</app-paginator>
						</td>
					</tr>
				</tfoot>
			</table>
		`
	}
}

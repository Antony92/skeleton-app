import { html, LitElement, css } from 'lit'
import { customElement, queryAll, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '../elements/app-paginator.element'
import { debounce, debounceTime, Subject, timer, filter, Subscription } from 'rxjs'

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

	@queryAll('sl-input') inputs!: NodeListOf<HTMLElementTagNameMap['sl-input']>
	@queryAll('sl-select') selects!: NodeListOf<HTMLElementTagNameMap['sl-select']>

	private searchQuery: SearchQuery = { skip: 0, limit: 10 }

	private $filterEvent = new Subject<FilterColumnEvent>()
	private $searchEvent = new Subject<string>()

	private filterSubscription: Subscription | null = null
	private searchSubscription: Subscription | null = null

	private clearingFilters = false

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
		this.filterSubscription = this.$searchEvent
			.pipe(
				filter(() => !this.clearingFilters),
				debounceTime(300)
			)
			.subscribe((value) => {
				this.searchQuery.search = value
				this.loadUsers()
			})
		this.searchSubscription = this.$filterEvent
			.asObservable()
			.pipe(
				filter(() => !this.clearingFilters),
				debounce((event) => (['number', 'text'].includes(event.column.type) ? timer(300) : timer(0)))
			)
			.subscribe((event) => {
				const value = event.value?.toString()
				if (value) {
					this.searchQuery[event.column.field] = value
				} else {
					delete this.searchQuery[event.column.field]
				}
				this.loadUsers()
			})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.filterSubscription?.unsubscribe()
		this.searchSubscription?.unsubscribe()
	}

	private async loadUsers() {
		console.log('search query: ', this.searchQuery)
		this.data = await getUsers(this.searchQuery)
	}

	page(event: CustomEvent) {
		const { pageSize, pageIndex } = event.detail
		this.searchQuery.limit = pageSize
		this.searchQuery.skip = pageSize * pageIndex
		this.loadUsers()
	}

	search(value: string) {
		this.$searchEvent.next(value)
	}

	filterColumn(event: FilterColumnEvent) {
		this.$filterEvent.next(event)
	}

	sortColumn(column: Column) {
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

		this.loadUsers()
	}

	async clearFilters() {
		this.clearingFilters = true

		this.searchQuery = { skip: 0, limit: this.searchQuery.limit }
		this.columns.forEach((col) => (col.sort = null))
		this.inputs.forEach((input) => (input.value = ''))
		this.selects.forEach((select) => (select.value = select.multiple ? [] : ''))

		this.requestUpdate()

		await this.loadUsers()

		this.clearingFilters = false
	}

	override render() {
		return html`
			<sl-input clearable type="search" placeholder="Search" @sl-input=${(event: Event) => this.search((event.target as HTMLInputElement).value)}>
				<sl-icon name="search" slot="prefix"></sl-icon>
			</sl-input>
			<br />
			<sl-button variant="default" @click=${() => this.clearFilters()}>
				<sl-icon slot="prefix" name="funnel"></sl-icon>
				Clear filters
			</sl-button>
			<table>
				<thead>
					<tr>
						${this.columns.map(
							(column) => html`
								<th class="sortable" @click=${() => this.sortColumn(column)}>
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
										column.type === 'text',
										() => html`
											<sl-input
												clearable
												type="text"
												placeholder="Filter by ${column.header}"
												@sl-input=${(event: Event) =>
													this.filterColumn({ column, value: (event.target as HTMLInputElement).value })}
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
													this.filterColumn({ column, value: (event.target as HTMLInputElement).value })}
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
													this.filterColumn({ column, value: (event.target as HTMLInputElement).value })}
											>
											</sl-input>
										`
									)}
									${when(
										column.type === 'select',
										() => html`
											<sl-select
												clearable
												multiple
												placeholder="Filter by ${column.header}"
												@sl-change=${(event: CustomEvent) =>
													this.filterColumn({ column, value: (event.target as HTMLElementTagNameMap['sl-select']).value })}
											>
												<sl-menu-item value="option-1">Option 1</sl-menu-item>
												<sl-menu-item value="option-2">Option 2</sl-menu-item>
												<sl-menu-item value="option-3">Option 3</sl-menu-item>
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
								<td colspan=${this.columns.length}>${!this.data ? 'Loading...' : 'No results found'}</td>
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

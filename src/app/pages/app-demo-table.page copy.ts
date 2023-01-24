import { html, LitElement, css } from 'lit'
import { customElement, query, queryAll, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'
import { getUsers } from '../services/api.service'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import '../elements/app-paginator.element'
import { debounce, Subject, timer, Subscription } from 'rxjs'
import { SearchQuery } from '../types/search.type'
import { TableColumn } from '../types/table.type'
import { tableLoaderStyle, tableStyle, tableWrapperStyle } from '../styles/table.style'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = [
		tableWrapperStyle,
		tableLoaderStyle,
		tableStyle,
		css`
			.search-box {
				display: flex;
				flex-wrap: wrap;
				gap: 15px;
				justify-content: space-between;
				margin-bottom: 10px;
			}

			.search-box sl-input {
				width: 350px;
			}

			app-paginator {
				margin-top: 5px;
			}
		`,
	]

	@query('app-paginator')
	paginator!: HTMLElementTagNameMap['app-paginator']

	@state()
	private data: any = null

	@state()
	private loadingData = false

	private skip = 0

	private limit = 0

	private searchQuery: SearchQuery = { }

	private $filterEvent = new Subject<FilterTableEvent>()

	private filterSubscription: Subscription | null = null

	private filtersApplied = false

	private columns: TableColumn[] = [
		{ header: 'Name', field: 'name', type: 'string' },
		{ header: 'Username', field: 'username', type: 'string' },
		{ header: 'Email', field: 'email', type: 'string' },
		{ header: 'Website', field: 'website', type: 'string'},
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
		this.loadData()
		this.filterSubscription = this.$filterEvent
			.asObservable()
			.pipe(debounce((event) => (event.delay ? timer(event.delay) : timer(0))))
			.subscribe((event) => {
				const value = event.value?.toString()
				if (value) {
					this.searchQuery[event.field] = value
				} else {
					delete this.searchQuery[event.field]
				}
				this.filtersApplied = Object.keys(this.searchQuery).length > 0
				this.loadData(true)
			})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.filterSubscription?.unsubscribe()
	}

	private async loadData(reset = false) {
		console.log('search query: ', this.searchQuery)
		this.loadingData = true
		if (reset) {
			this.skip = 0
			this.paginator.pageIndex = 0
		}
		this.data = await getUsers({ skip: this.skip, limit: this.limit, ...this.searchQuery })
		this.loadingData = false
	}

	private page(event: CustomEvent) {
		const { pageSize, pageIndex } = event.detail
		this.limit = pageSize
		this.skip = pageSize * pageIndex
		this.loadData()
	}

	private filter(event: FilterTableEvent) {
		this.$filterEvent.next(event)
	}

	private sort(column: TableColumn) {
		this.columns.filter((col) => col.field !== column.field).forEach((col) => (col.order = null))

		if (!column.order) {
			column.order = 'asc'
		} else if (column.order === 'asc') {
			column.order = 'desc'
		} else if (column.order === 'desc') {
			column.order = null
		}

		this.requestUpdate()

		if (column.order) {
			this.searchQuery.order = column.order
			this.searchQuery.sort = column.field
		} else {
			delete this.searchQuery.order
			delete this.searchQuery.sort
		}

		this.filtersApplied = Object.keys(this.searchQuery).length > 0

		this.loadData()
	}

	private async clearFilters() {
		this.filtersApplied = false
		this.searchQuery = {}

		this.columns.forEach((col) => (col.order = null))

		this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-input']>('table thead sl-input')
			.forEach((input) => (input.value = ''))
		this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-select']>('table thead sl-select')
			.forEach((select) => (select.value = select.multiple ? [] : ''))

		await this.loadData(true)
	}

	override render() {
		return html`
			<div class="search-box">
				<sl-input
					autocomplete="off"
					filled
					pill
					clearable
					type="search"
					placeholder="Search"
					@sl-input=${(event: Event) =>
						this.filter({ delay: 300, field: 'search', value: (<HTMLElementTagNameMap['sl-input']>event.target).value })}
				>
					<sl-icon name="search" slot="prefix"></sl-icon>
				</sl-input>

				<sl-button variant="default" pill @click=${this.clearFilters} ?disabled=${!this.filtersApplied}>
					<sl-icon slot="prefix" name="funnel"></sl-icon>
					Clear filters
				</sl-button>
			</div>

			<div class="table-wrapper">
				<div class="table-loader" ?hidden=${!this.loadingData}>
					<sl-spinner></sl-spinner>
				</div>
				<table>
					<thead>
						<tr>
							${this.columns.map(
								(column) => html`
									<th class=${classMap({ sortable: !!column.sortable })} @click=${() => (column.sortable ? this.sort(column) : '')}>
										${column.header} 
										${when(column.sortable && column.order === 'asc', () => html`<sl-icon name="sort-up"></sl-icon>`)}
										${when(column.sortable && column.order === 'desc', () => html`<sl-icon name="sort-down"></sl-icon>`)}
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
													filled
													pill
													autocomplete="off"
													clearable
													type="text"
													placeholder="Filter by ${column.header}"
													@sl-input=${(event: CustomEvent) =>
														this.filter({
															delay: 300,
															field: column.field,
															value: (<HTMLElementTagNameMap['sl-input']>event.target).value,
														})}
												>
												</sl-input>
											`
										)}
										${when(
											column.type === 'number',
											() => html`
												<sl-input
													pill
													clearable
													type="number"
													placeholder="Filter by ${column.header}"
													@sl-input=${(event: CustomEvent) =>
														this.filter({
															delay: 300,
															field: column.field,
															value: (<HTMLElementTagNameMap['sl-input']>event.target).value,
														})}
												>
												</sl-input>
											`
										)}
										${when(
											column.type === 'date',
											() => html`
												<sl-input
													pill
													clearable
													type="date"
													placeholder="Filter by ${column.header}"
													@sl-input=${(event: CustomEvent) =>
														this.filter({
															field: column.field,
															value: (<HTMLElementTagNameMap['sl-input']>event.target).value,
														})}
												>
												</sl-input>
											`
										)}
										${when(
											column.type === 'boolean',
											() => html`
												<sl-select
													pill
													filled
													hoist
													clearable
													placeholder="Filter by ${column.header}"
													@sl-change=${(event: CustomEvent) =>
														this.filter({
															field: column.field,
															value: (<HTMLElementTagNameMap['sl-select']>event.target).value,
														})}
												>
													${column.values?.map((v) => html`<sl-option value=${v.value}>${v.label}</sl-option>`)}
												</sl-select>
											`
										)}
										${when(
											column.type === 'select',
											() => html`
												<sl-select
													pill
													filled
													hoist
													clearable
													placeholder="Filter by ${column.header}"
													max-options-visible="2"
													@sl-change=${(event: CustomEvent) =>
														this.filter({
															field: column.field,
															value: (<HTMLElementTagNameMap['sl-select']>event.target).value,
														})}
												>
													${column.values?.map((v) => html`<sl-option value=${v.value}>${v.label}</sl-option>`)}
												</sl-select>
											`
										)}
										${when(
											column.type === 'select-multiple',
											() => html`
												<sl-select
													pill
													filled
													hoist
													clearable
													multiple
													placeholder="Filter by ${column.header}"
													max-options-visible="2"
													@sl-change=${(event: CustomEvent) =>
														this.filter({
															field: column.field,
															value: (<HTMLElementTagNameMap['sl-select']>event.target).value,
														})}
												>
													${column.values?.map((v) => html`<sl-option value=${v.value}>${v.label}</sl-option>`)}
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
				</table>
			</div>

			<app-paginator @app-paginate=${this.page} pageSize="10" .pageSizeOptions=${[5, 10, 15]} length=${this.data?.total}> </app-paginator>
		`
	}
}

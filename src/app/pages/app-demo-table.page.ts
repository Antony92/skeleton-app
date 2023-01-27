import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import '../elements/paginator/app-paginator.element'
import '../elements/table/app-table.element'
import '../elements/table/app-table-head.element'
import '../elements/table/app-table-heading.element'
import '../elements/table/app-table-body.element'
import '../elements/table/app-table-row.element'
import '../elements/table/app-table-cell.element'
import { TableColumn } from '../types/table.type'
import { getUsers } from '../services/api.service'
import { SearchParams } from '../types/search.type'
import { AppPaginator } from '../elements/paginator/app-paginator.element'
import { when } from 'lit/directives/when.js'
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import { addSearchParamsToURL } from '../utils/general'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
	static styles = css``

	@query('app-paginator')
	paginator!: AppPaginator

	#skip = 0

	#limit = 10

	#searchParams: SearchParams = {}

	@state()
	loading = false

	@state()
	users = {
		data: [] as any[],
		total: 0
	}

	@state()
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
			list: [
				{ label: 'Gwenborough', value: 'Gwenborough' },
				{ label: 'Wisokyburgh', value: 'Wisokyburgh' },
				{ label: 'McKenziehaven', value: 'McKenziehaven' },
			],
		},
	]

	connectedCallback() {
		super.connectedCallback()
		this.init()
		this.loadUsers()
		this.addEventListener('app-table-filter', async (event) => {
			this.#searchParams = (<CustomEvent>event).detail
			this.#skip = 0
			await this.loadUsers()
			this.paginator.reset()
		})
		this.addEventListener('app-paginate', async (event) => {
			const { pageSize, pageIndex } = (<CustomEvent>event).detail
            this.#limit = pageSize
			localStorage.setItem('limit', this.#limit.toString())
            this.#skip = pageSize * pageIndex
			await this.loadUsers()
		})
		this.addEventListener('app-table-clear', async () => {
			this.#searchParams = {}
			this.#skip = 0
			this.columns.forEach(column => {
				column.selected = ''
				column.order = null
			})
			await this.loadUsers()
			this.paginator.reset()
		})
	}

	firstUpdated() {
		this.paginator.pageIndex = this.#skip || 1 / this.#limit || 1
	}

	init() {
		const search = Object.fromEntries(new URLSearchParams(window.location.search))
		this.#skip = parseInt(search.skip) || this.#skip
		this.#limit = parseInt(localStorage.getItem('limit')?.toString() || '') || parseInt(search.limit) || this.#limit
		delete search['skip']
		delete search['limit']
		this.#searchParams = search
		Object.keys(this.#searchParams).forEach(key => {
			const column = this.columns.find(column => column.field === key)
			if (column) {
				column.selected = this.#searchParams[key]
			}
		})
		const sorted = this.columns.find(column => column.field === this.#searchParams['sort'])
		if (sorted) {
			sorted.order = this.#searchParams['order'] as never
		}
	}

	async loadUsers() {
		this.loading = true
		this.users = await getUsers({ skip: this.#skip, limit: this.#limit, ...this.#searchParams })
		this.users.data.forEach(user => {
			user.checked = false
		})
		this.loading = false
		addSearchParamsToURL({ skip: this.#skip, limit: this.#limit, ...this.#searchParams })
	}

	toggleAllSelection(event: CustomEvent) {
		const checkbox = <SlCheckbox>event.target
		this.users.data.forEach(user => {
			user.checked = checkbox.checked
		})
		this.requestUpdate()
	}

	toggleSingleSelection(event: CustomEvent, user: any) {
		user.checked = (<SlCheckbox>event.target).checked
		this.requestUpdate()
	}

	isIndeterminate() {
		return this.users.data.some(user => user.checked)
	}

	isChecked() {
		return this.users.data.length > 0 && this.users.data.every(user => user.checked)
	}

	hasFiltersApplied() {
		return Object.keys(this.#searchParams).length > 0
	}

	render() {
		return html`
			<app-table 
				searchable 
				clearable 
				?loading=${this.loading} 
				.filtersApplied=${this.hasFiltersApplied()}
				.searchValue=${this.#searchParams.search}
			>
				<app-table-head>
					<app-table-heading>
						<sl-checkbox 
							?indeterminate=${this.isIndeterminate()}
							?checked=${this.isChecked()}
							@sl-change=${this.toggleAllSelection}>
						</sl-checkbox>
					</app-table-heading>
					${this.columns.map((column) => html`
						<app-table-heading 
							?sortable=${column.sortable}
							?filterable=${column.filtarable}
							.label=${column.header}
							.field=${column.field}
							.type=${column.type || 'text'}
							.delay=${column.delay || 0}
							.list=${column.list || []}
							.selected=${column.selected || ''}
							.order=${column.order || null}
						>
							${column.header}
						</app-table-heading>
					`)}
				</app-table-head>
				<app-table-body>
					${this.users.data.map(user => html`
						<app-table-row>
							<app-table-cell>
								<sl-checkbox 
								?checked=${user.checked} 
								@sl-change=${(event: CustomEvent) => this.toggleSingleSelection(event, user)}>
							</sl-checkbox>
							</app-table-cell>
							<app-table-cell textlimit>${user.name}</app-table-cell>
							<app-table-cell textlimit>${user.username}</app-table-cell>
							<app-table-cell textlimit>${user.email}</app-table-cell>
							<app-table-cell textlimit>${user.website}</app-table-cell>
							<app-table-cell textlimit>${user.address.city}</app-table-cell>
						</app-table-row>
					`)}
					${when(this.users.data.length === 0 && !this.loading, () => html`
						<app-table-row>
							<app-table-cell noresult>No results found</app-table-cell>
						</app-table-row>
					`)}
				</app-table-body>
				
				<app-paginator 
					slot="paginator"
					.pageSize=${this.#limit} 
					.pageSizeOptions=${[5, 10, 15]} 
					length=${this.users.total}
				>
				</app-paginator>
			</app-table>
		`
	}
}

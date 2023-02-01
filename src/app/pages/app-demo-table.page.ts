import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js'
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
import { addSearchParamsToURL, getURLSearchParamsAsObject } from '../utils/url'

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
		total: 0,
	}

	selection: any[] = []

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
		this.addEventListener('app-table-filter', async (event) => {
			this.#searchParams = (<CustomEvent>event).detail
			addSearchParamsToURL({ ...this.#searchParams })
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
			addSearchParamsToURL({ ...this.#searchParams })
			this.#skip = 0
			this.columns.forEach((column) => {
				column.value = ''
				column.order = null
			})
			await this.loadUsers()
			this.paginator.reset()
		})
	}

	async init() {
		this.#searchParams = getURLSearchParamsAsObject()
		this.#limit = Number(localStorage.getItem('limit')) || this.#limit
		Object.keys(this.#searchParams).forEach((key) => {
			const column = this.columns.find((column) => column.field === key)
			if (column) {
				column.value = this.#searchParams[key]
			}
		})
		const sorted = this.columns.find((column) => column.field === this.#searchParams['sort'])
		if (sorted) {
			sorted.order = this.#searchParams['order'] as never
		}
		await this.loadUsers()
	}

	async loadUsers() {
		this.loading = true
		this.users = await getUsers({ skip: this.#skip, limit: this.#limit, ...this.#searchParams })
		this.loading = false
		this.users.data.forEach((user) => {
			user.selected = this.selection.find((selected) => selected.id === user.id) ? true : false
		})
	}

	toggleAllSelection(event: CustomEvent) {
		const checkbox = <SlCheckbox>event.target
		this.users.data.forEach((user) => {
			user.selected = checkbox.checked
			if (user.selected) {
				this.selection.push(user)
			} else {
				this.selection = this.selection.filter((selected) => selected.id !== user.id)
			}
		})
		this.requestUpdate()
	}

	toggleSingleSelection(event: CustomEvent, user: any) {
		user.selected = (<SlCheckbox>event.target).checked
		if (user.selected) {
			this.selection.push(user)
		} else {
			this.selection = this.selection.filter((selected) => selected.id !== user.id)
		}
		this.requestUpdate()
	}

	isIndeterminate() {
		return this.users.data.some((user) => user.selected)
	}

	isChecked() {
		return this.users.data.length > 0 && this.users.data.every((user) => user.selected)
	}

	hasFiltersApplied() {
		return Object.keys(this.#searchParams).length > 0
	}

	deselectAll() {
		this.selection = []
		this.users.data.forEach((user) => (user.selected = false))
		this.requestUpdate()
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

				<sl-dropdown slot="actions">
					<sl-button slot="trigger" variant="primary" pill caret ?disabled=${this.selection.length === 0}>
						Selection
					</sl-button>
					<sl-menu>
						<sl-menu-item @click=${() => this.renderRoot.querySelector('sl-dialog')?.show()}>
							View selected
						</sl-menu-item>
						<sl-divider></sl-divider>
						<sl-menu-item @click=${this.deselectAll}>
							Deselect all
							<sl-icon slot="prefix" name="x-square-fill"></sl-icon>
						</sl-menu-item>
					</sl-menu>
				</sl-dropdown>

				<app-table-head>
					<app-table-heading>
						<sl-checkbox ?indeterminate=${this.isIndeterminate()} ?checked=${this.isChecked()} @sl-change=${this.toggleAllSelection}>
						</sl-checkbox>
					</app-table-heading>
					${this.columns.map(
						(column) => html`
							<app-table-heading
								?sortable=${column.sortable}
								?filterable=${column.filtarable}
								.label=${column.header}
								.field=${column.field}
								.type=${column.type || 'text'}
								.delay=${column.delay || 0}
								.list=${column.list || []}
								.value=${column.value || ''}
								.order=${column.order || null}
							>
								${column.header}
							</app-table-heading>
						`
					)}
				</app-table-head>
				<app-table-body>
					${this.users.data.map(
						(user) => html`
							<app-table-row>
								<app-table-cell>
									<sl-checkbox
										?checked=${user.selected}
										@sl-change=${(event: CustomEvent) => this.toggleSingleSelection(event, user)}
									>
									</sl-checkbox>
								</app-table-cell>
								<app-table-cell textlimit>${user.name}</app-table-cell>
								<app-table-cell textlimit>${user.username}</app-table-cell>
								<app-table-cell textlimit>${user.email}</app-table-cell>
								<app-table-cell textlimit>${user.website}</app-table-cell>
								<app-table-cell textlimit>${user.address.city}</app-table-cell>
							</app-table-row>
						`
					)}
					${when(
						this.users.data.length === 0 && !this.loading,
						() => html`
							<app-table-row>
								<app-table-cell noresult>No results found</app-table-cell>
							</app-table-row>
						`
					)}
				</app-table-body>

				<app-paginator slot="paginator" .pageSize=${this.#limit} .pageSizeOptions=${[5, 10, 15]} .total=${this.users.total}> </app-paginator>
			</app-table>
			<sl-dialog label="Selection">
				<ul>
					${this.selection.map(user => html`<li>${user.username}</li>`)}
				</ul>
				<sl-button slot="footer" variant="primary" @click=${() => this.renderRoot.querySelector('sl-dialog')?.hide()}>Close</sl-button>
			</sl-dialog>
		`
	}
}

import { html, LitElement, css, PropertyValues } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { appPageTitleStyle } from '@app/styles/main.style'
import { AppPaginator } from '@app/elements/paginator/app-paginator.element'
import { TableColumn } from '@app/types/table.type'
import { addSearchParamsToURL, clearSearchParamsFromURL, getURLSearchParamsAsMap } from '@app/utils/url'
import { getAuditLogs } from '@app/services/audit-logs.service'
import { when } from 'lit/directives/when.js'
import '@app/elements/paginator/app-paginator.element'
import '@app/elements/table/app-table.element'
import '@app/elements/table/app-table-column-filter.element'
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import { setDocumentTitle } from '@app/utils/html'
import { appTableStyle } from '@app/styles/table.style'
import { AppTable } from '@app/elements/table/app-table.element'

@customElement('app-ad-audit-logs')
export class AppADAuditLogs extends LitElement {
	static styles = [
		appPageTitleStyle,
		appTableStyle,
		css`
			pre {
				overflow: auto;
				max-height: 350px;
				background: var(--sl-color-gray-100);
				border-radius: 5px;
				padding: 10px;
			}

			.impersonated-icon {
				vertical-align: middle;
				color: orange;
			}
		`,
	]

	@query('app-table')
	accessor table!: AppTable

	@query('app-paginator')
	accessor paginator!: AppPaginator

	@query('data-dialog')
	dataDialog!: SlDialog

	private searchParamsMap = new Map()
	private skip = 0
	private limit = 10

	@state()
	accessor loading = false

	@state()
	accessor auditLogs = {
		data: [] as any[],
		total: 0,
	}

	@state()
	accessor data = ''

	@state()
	accessor columns: TableColumn[] = [
		{ header: 'Name', field: 'name', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Username', field: 'username', type: 'text', sortable: true, filtarable: true, delay: 300 },
		{ header: 'Impersonated by', field: 'impersonated', type: 'text', filtarable: true, delay: 300 },
		{
			header: 'Action',
			field: 'action',
			type: 'select-multiple',
			filtarable: true,
			list: [
				{ label: 'CREATE', value: 'CREATE' },
				{ label: 'UPDATE', value: 'UPDATE' },
				{ label: 'DELETE', value: 'DELETE' },
			],
		},
		{ header: 'Target', field: 'target', type: 'text', filtarable: true, delay: 300 },
		{ header: 'Message', field: 'message', type: 'text', filtarable: true, delay: 300 },
		{ header: 'Created', field: 'created', type: 'date', sortable: true },
	]

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Admin - Audit Logs')
		this.init()
	}

	protected async firstUpdated() {
		this.table.addEventListener('app-table-filter', async (event) => {
			this.searchParamsMap = event.filters
			addSearchParamsToURL(Object.fromEntries(this.searchParamsMap))
			this.skip = 0
			await this.loadAuditLogs()
			this.paginator.reset()
		})
		this.paginator.addEventListener('app-paginate', async (event) => {
			const { pageSize, pageIndex } = event.value
			this.limit = pageSize
			localStorage.setItem('audit-logs-table-limit', this.limit.toString())
			this.skip = pageSize * pageIndex
			await this.loadAuditLogs()
		})
		this.table.addEventListener('app-table-clear', async () => {
			this.searchParamsMap.clear()
			clearSearchParamsFromURL()
			this.skip = 0
			this.columns.forEach((column) => {
				column.value = ''
				column.order = null
			})
			await this.loadAuditLogs()
			this.paginator.reset()
		})
	}

	async init() {
		this.searchParamsMap = getURLSearchParamsAsMap()
		this.limit = Number(localStorage.getItem('audit-logs-table-limit')) || this.limit
		this.columns.forEach(column => {
			column.value = this.searchParamsMap.get(column.field) || column.value
			if (column.field === this.searchParamsMap.get('sort')) {
				column.order = this.searchParamsMap.get('order')
			}
		})
		await this.loadAuditLogs()
	}

	async loadAuditLogs() {
		this.loading = true
		this.auditLogs = await getAuditLogs({ skip: this.skip, limit: this.limit, ...Object.fromEntries(this.searchParamsMap) })
		this.loading = false
	}

	openDataDialog(data: any) {
		this.data = JSON.stringify(data, null, 2)
		this.dataDialog.show()
	}

	render() {
		return html`
			<h3 class="title">Audit Logs</h3>
			<app-table searchable clearable .searchValue=${this.searchParamsMap.get('search')} .filtersApplied=${this.searchParamsMap.size > 0}>
				<table slot="table">
					<thead>
						<tr>
							<th action sticky></th>
							${this.columns.map((column) => html`
								<th>
									<app-table-column-filter
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
									</app-table-column-filter>
								</th>
							`)}
						</tr>
					</thead>
					<tbody>
						${this.auditLogs.data.map(
							(audit) => html`
								<tr>
									<td sticky>
										<sl-icon-button
											name="braces"
											label="Data"
											title="View data"
											@click=${() => this.openDataDialog(audit.data)}
										></sl-icon-button>
									</td>
									<td>${audit.name}</td>
									<td>${audit.username}</td>
									<td>${audit.impersonated}</td>
									<td>${audit.action}</td>
									<td>${audit.target}</td>
									<td textlimit title=${audit.message}>${audit.message}</td>
									<td>
										<sl-format-date
											month="long"
											day="numeric"
											year="numeric"
											hour="numeric"
											minute="numeric"
											.date=${audit.created || ''}
										></sl-format-date>
									</td>
								</tr>
							`
						)}
						${when(
							this.auditLogs.data.length === 0 && this.loading,
							() => html`
								<tr>
									<td colspan=${this.columns.length}>Loading...</td>
								</tr>
							`
						)}
						${when(
							this.auditLogs.data.length === 0 && !this.loading,
							() => html`
								<tr>
									<td colspan=${this.columns.length}>No results found</td>
								</tr>
							`
						)}
					</tbody>
				</table>
				<app-paginator
					slot="paginator"
					.pageSize=${this.limit}
					.pageSizeOptions=${[5, 10, 15]}
					.total=${this.auditLogs.total}
				></app-paginator>
			</app-table>
			
			<sl-dialog label="Data" id="data-dialog">
				<pre><code>${this.data}</code></pre>
				<sl-button slot="footer" variant="primary" @click=${() => this.dataDialog.hide()}>Close</sl-button>
			</sl-dialog>
		`
	}
}

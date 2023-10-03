import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { appPageTitleStyle } from '../../styles/main.style'
import { AppPaginator } from '../../elements/paginator/app-paginator.element'
import { TableColumn } from '../../types/table.type'
import { addSearchParamsToURL, clearSearchParamsFromURL, getURLSearchParamsAsObject } from '../../utils/url'
import { getAuditLogs } from '../../services/audit-logs.service'
import { when } from 'lit/directives/when.js'
import '../../elements/paginator/app-paginator.element'
import '../../elements/table/app-table.element'
import '../../elements/table/app-table-head.element'
import '../../elements/table/app-table-heading.element'
import '../../elements/table/app-table-body.element'
import '../../elements/table/app-table-row.element'
import '../../elements/table/app-table-cell.element'
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import { setDocumentTitle } from '../../utils/html'

@customElement('app-ad-audit-logs')
export class AppADAuditLogs extends LitElement {
	static styles = [
		appPageTitleStyle,
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

	@query('app-paginator')
	paginator!: AppPaginator

	@query('.data-dialog')
	dataDialog!: SlDialog

	#skip = 0

	#limit = 10

	#searchParamsMap = new Map()

	@state()
	loading = false

	@state()
	auditLogs = {
		data: [] as any[],
		total: 0,
	}

	@state()
	data = ''

	@state()
	columns: TableColumn[] = [
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
		this.addEventListener('app-table-filter', async (event) => {
			this.#searchParamsMap = (<CustomEvent>event).detail
			addSearchParamsToURL(Object.fromEntries(this.#searchParamsMap))
			this.#skip = 0
			await this.loadAuditLogs()
			this.paginator.reset()
		})
		this.addEventListener('app-paginate', async (event) => {
			const { pageSize, pageIndex } = (<CustomEvent>event).detail
			this.#limit = pageSize
			localStorage.setItem('audit-logs-table-limit', this.#limit.toString())
			this.#skip = pageSize * pageIndex
			await this.loadAuditLogs()
		})
		this.addEventListener('app-table-clear', async () => {
			this.#searchParamsMap.clear()
			clearSearchParamsFromURL()
			this.#skip = 0
			this.columns.forEach((column) => {
				column.value = ''
				column.order = null
			})
			await this.loadAuditLogs()
			this.paginator.reset()
		})
	}

	async init() {
		this.#searchParamsMap = new Map(Object.entries(getURLSearchParamsAsObject()))
		this.#limit = Number(localStorage.getItem('audit-logs-table-limit')) || this.#limit
		this.#searchParamsMap.forEach((value, key) => {
			const column = this.columns.find((column) => column.field === key)
			if (column) {
				column.value = value
			}
		})
		const sortColumn = this.columns.find((column) => column.field === this.#searchParamsMap.get('sort'))
		if (sortColumn) {
			sortColumn.order = this.#searchParamsMap.get('order')
		}
		await this.loadAuditLogs()
	}

	async loadAuditLogs() {
		this.loading = true
		this.auditLogs = await getAuditLogs({ skip: this.#skip, limit: this.#limit, ...Object.fromEntries(this.#searchParamsMap) })
		this.loading = false
	}

	openDataDialog(data: any) {
		this.data = JSON.stringify(data, null, 2)
		this.dataDialog.show()
	}

	render() {
		return html`
			<h3 class="title">Audit Logs</h3>
			<app-table searchable clearable .searchValue=${this.#searchParamsMap.get('search')} .searchParamsMap=${this.#searchParamsMap}>
				<app-table-head>
					<app-table-heading action sticky></app-table-heading>
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
					${this.auditLogs.data.map(
						(audit) => html`
							<app-table-row>
								<app-table-cell sticky>
									<sl-icon-button
										name="braces"
										label="Data"
										title="View data"
										@click=${() => this.openDataDialog(audit.data)}
									></sl-icon-button>
								</app-table-cell>
								<app-table-cell>${audit.name}</app-table-cell>
								<app-table-cell>${audit.username}</app-table-cell>
								<app-table-cell>${audit.impersonated}</app-table-cell>
								<app-table-cell>${audit.action}</app-table-cell>
								<app-table-cell>${audit.target}</app-table-cell>
								<app-table-cell textlimit title=${audit.message}>${audit.message}</app-table-cell>
								<app-table-cell>
									<sl-format-date
										month="long"
										day="numeric"
										year="numeric"
										hour="numeric"
										minute="numeric"
										.date=${audit.created || ''}
									></sl-format-date>
								</app-table-cell>
							</app-table-row>
						`
					)}
					${when(
						this.auditLogs.data.length === 0 && this.loading,
						() => html`
							<app-table-row>
								<app-table-cell noresult>Loading...</app-table-cell>
							</app-table-row>
						`
					)}
					${when(
						this.auditLogs.data.length === 0 && !this.loading,
						() => html`
							<app-table-row>
								<app-table-cell noresult>No results found</app-table-cell>
							</app-table-row>
						`
					)}
				</app-table-body>
				<app-paginator
					slot="paginator"
					.pageSize=${this.#limit}
					.pageSizeOptions=${[5, 10, 15]}
					.total=${this.auditLogs.total}
				></app-paginator>
			</app-table>
			<sl-dialog label="Data" class="data-dialog">
				<pre><code>${this.data}</code></pre>
				<sl-button slot="footer" variant="primary" @click=${() => this.dataDialog.hide()}>Close</sl-button>
			</sl-dialog>
		`
	}
}

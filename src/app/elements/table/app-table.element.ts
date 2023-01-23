import { html, LitElement, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import { Subject, Subscription, debounceTime } from 'rxjs'
import { SearchQuery } from '../../types/search.type'
import { appTableFilterBoxStyle, appTableLoaderStyle, appTableStyle, appTableWrapperStyle } from '../../styles/app-table.style'

@customElement('app-table')
export class AppTable extends LitElement {
	static styles = [
		appTableFilterBoxStyle,
		appTableLoaderStyle,
        appTableWrapperStyle,
		appTableStyle,
		css`
			::slotted(app-paginator) {
				margin-top: 5px;
			}
		`,
	]

    @property({ type: Boolean })
	searchable = false

    @property({ type: Boolean })
	clearable = false

    @property({ type: Array })
	columns: any[] = []

    @property({ type: Array })
	data: unknown[] = []

	@state()
	private loadingData = false

    private skip = 0

    private limit = 10

	private searchQuery: SearchQuery = { }

	private $searchEvent = new Subject<string>()

	private searchSubscription: Subscription | null = null

	private filtersApplied = false

	override connectedCallback() {
		super.connectedCallback()
		this.searchSubscription = this.$searchEvent
			.asObservable()
			.pipe(debounceTime(300))
			.subscribe((value) => {
				// if (value) {
				// 	this.searchQuery[event.field] = value
				// } else {
				// 	delete this.searchQuery[event.field]
				// }
				// this.filtersApplied = Object.keys(this.searchQuery).length > 0
				// this.loadData(true)
			})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.searchSubscription?.unsubscribe()
	}

    override firstUpdated() {
        this.paginator?.addEventListener('app-paginate', (event) => {
            const { pageSize, pageIndex } = (<CustomEvent>event).detail
            this.limit = pageSize
            this.skip = pageSize * pageIndex
            this.loadData()
        })
    }

	private loadData(reset = false) {
		console.log('search query: ', this.searchQuery)
		this.loadingData = true
		if (reset) {
			this.skip = 0
			this.paginator?.setAttribute('pageIndex', '0')
		}
        this.dispatchEvent(new CustomEvent('app-table-load', {
            bubbles: true,
            composed: true,
            detail: {
                limit: this.limit,
                skip: this.skip,
                ...this.searchQuery
            }
        }))
		this.loadingData = false
	}

	private search(value: string) {
		this.$searchEvent.next(value)
	}

	private sort(column: any) {
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

		this.loadData()
	}

	private async clearAllFilters() {
		this.filtersApplied = false
		this.searchQuery = {}

		this.columns.forEach((col) => (col.sort = null))

		this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-input']>('table thead sl-input')
			.forEach((input) => (input.value = ''))
		this.renderRoot
			.querySelectorAll<HTMLElementTagNameMap['sl-select']>('table thead sl-select')
			.forEach((select) => (select.value = select.multiple ? [] : ''))

		this.loadData(true)
	}


    get paginator() {
        const slot = this.renderRoot.querySelector('slot[name=paginator]')
        return (<HTMLSlotElement>slot).assignedElements().filter((node) => node.matches('app-paginator'))[0]
    }

	override render() {
		return html`
			<div class="filter-box">

                ${when(this.searchable, () => html`
                    <sl-input
                        autocomplete="off"
                        filled
                        pill
                        clearable
						class="global-search"
                        type="search"
                        placeholder="Search"
                        @sl-input=${(event: CustomEvent) => this.search((<HTMLElementTagNameMap['sl-input']>event.target).value)}
                    >
                        <sl-icon name="search" slot="prefix"></sl-icon>
                    </sl-input>
                `)}

                ${when(this.clearable, () => html`
                    <sl-button variant="default" pill @click=${this.clearAllFilters} ?disabled=${!this.filtersApplied}>
                        <sl-icon slot="prefix" name="funnel"></sl-icon>
                        Clear filters
                    </sl-button>
                `)}

			</div>

			<div class="table-wrapper">
				<div class="table-loader" ?hidden=${!this.loadingData}>
					<sl-spinner></sl-spinner>
				</div>
				<div class="table">
					<slot name="head"></slot>
					<slot name="body"></slot>
				</div>
			</div>

            <slot name="paginator"></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table': AppTable
	}
}
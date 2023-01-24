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

	@property({ type: Boolean })
	loading = false

    private skip = 0

    private limit = 10

	private searchQuery: SearchQuery = { }

	private $searchEvent = new Subject<string>()

	private searchSubscription: Subscription = new Subscription()

	private filtersApplied = false

	override connectedCallback() {
		super.connectedCallback()
		this.searchSubscription = this.$searchEvent
			.asObservable()
			.pipe(debounceTime(300))
			.subscribe((value) => {
				if (value) {
					this.searchQuery.search = value
				} else {
					delete this.searchQuery.search
				}
				this.filtersApplied = this.hasFiltersApplied()
				this.dispatchFilterEvent()
			})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.searchSubscription.unsubscribe()
	}

    override firstUpdated() {
        this.addEventListener('app-table-column-filter', (event) => {
            const { field, value, order } = (<CustomEvent>event).detail
            if (value) {
                this.searchQuery[field] = value
            } else {
                delete this.searchQuery[field]
            }
            if (order) {
                this.searchQuery['sort'] = field
                this.searchQuery['order'] = order
            } else {
                delete this.searchQuery['sort']
                delete this.searchQuery['order']
            }
            this.filtersApplied = this.hasFiltersApplied()
            this.dispatchFilterEvent()
        })
    }

	private dispatchFilterEvent() {
        this.dispatchEvent(new CustomEvent('app-table-filter', {
            bubbles: true,
            composed: true,
            detail: this.searchQuery
        }))
	}

	private search(value: string) {
		this.$searchEvent.next(value)
	}

    private hasFiltersApplied() {
        return Object.keys(this.searchQuery).length > 0
    }

	
	private async clearAllFilters() {
		this.filtersApplied = false
		this.searchQuery = {}
		this.renderRoot
			.querySelectorAll('sl-input')
			.forEach((input) => (input.value = ''))
		this.headings?.forEach(heading => heading.clearAllFilters())
		this.dispatchEvent(new CustomEvent('app-table-clear', {
            bubbles: true,
            composed: true,
        }))
	}

	get headings() {
		const slot = this.renderRoot.querySelector('slot[name=head]')
		const head = (<HTMLSlotElement>slot).assignedElements().filter((node) => node.matches('app-table-head'))[0]
		return head?.querySelectorAll('app-table-heading')
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
				<div class="table-loader" ?hidden=${!this.loading}>
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
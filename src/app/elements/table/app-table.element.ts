import { html, LitElement, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js'
import { Subject, Subscription, timer, debounce } from 'rxjs'
import { appTableActionsBoxStyle, appTableStyle } from '../../styles/app-table.style'
import { SearchParams } from '../../types/search.type'


@customElement('app-table')
export class AppTable extends LitElement {
	static styles = [
		appTableActionsBoxStyle,
		appTableStyle,
		css`
			::slotted(app-paginator) {
				margin-top: 5px;
				justify-content: flex-end;
			}
		`,
	]

    @property({ type: Boolean })
	searchable = false

    @property({ type: Boolean })
	clearable = false

	@property({ type: String, attribute: 'search-value' })
	searchValue = ''

	@property({ type: Object })
	searchParams: SearchParams = {}

	@state()
	filtersApplied = false

	#searchParamsMap = new Map()

	#searchEvent = new Subject<string>()

	#searchSubscription: Subscription = new Subscription()

	connectedCallback() {
		super.connectedCallback()
		this.#searchParamsMap = new Map(Object.entries(this.searchParams))
		if (this.searchValue) {
			this.#searchParamsMap.set('search', this.searchValue)
		}
		this.addEventListener('app-table-column-filter', (event) => {
            const { field, value, order } = (<CustomEvent>event).detail
            if (value) {
				this.#searchParamsMap.set(field, value)
            } else {
				this.#searchParamsMap.delete(field)
            }
            if (order) {
				this.#searchParamsMap.set('sort', field)
				this.#searchParamsMap.set('order', order)
            } else {
				this.#searchParamsMap.delete('sort')
				this.#searchParamsMap.delete('order')
            }
            this.filtersApplied = this.hasFiltersApplied()
            this.#dispatchFilterEvent()
        })
		this.#searchSubscription = this.#searchEvent
			.asObservable()
			.pipe(debounce((value) => value ? timer(300) : timer(0)))
			.subscribe((value) => {
				if (value) {
					this.#searchParamsMap.set('search', value)
				} else {
					this.#searchParamsMap.delete('search')
				}
				this.filtersApplied = this.hasFiltersApplied()
				this.#dispatchFilterEvent()
			})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#searchSubscription.unsubscribe()
	}

	#dispatchFilterEvent() {
        this.dispatchEvent(new CustomEvent('app-table-filter', {
            bubbles: true,
            composed: true,
            detail: Object.fromEntries(this.#searchParamsMap)
        }))
	}

	globalSearch(value: string) {
		this.#searchEvent.next(value)
	}

    hasFiltersApplied() {
        return this.#searchParamsMap.size > 0
    }

	clearAllFilters() {
		this.filtersApplied = false
		this.#searchParamsMap.clear()
		this.renderRoot
			.querySelectorAll('sl-input')
			.forEach((input) => (input.value = ''))
		this.headings.forEach(heading => heading.clearFilters())
		this.dispatchEvent(new CustomEvent('app-table-clear', {
            bubbles: true,
            composed: true,
        }))
	}

	get headings() {
		const slot = this.renderRoot.querySelector('.table slot')
		const head = (<HTMLSlotElement>slot)?.assignedElements().filter((node) => node.matches('app-table-head'))[0]
		return Array.from(head?.querySelectorAll('app-table-heading') || [])
	}

	render() {
		return html`
			<div class="actions-box">
                ${when(this.searchable, () => html`
                    <sl-input
                        autocomplete="off"
                        filled
                        pill
                        clearable
						class="global-search"
                        type="search"
						.value=${this.searchValue || ''}
                        placeholder="Search"
                        @sl-input=${(event: CustomEvent) => this.globalSearch((<SlInput>event.target).value)}
                    >
                        <sl-icon name="search" slot="prefix"></sl-icon>
                    </sl-input>
                `)}
				<div class="action-buttons">
					<slot name="actions"></slot>
				</div>
				${when(this.clearable, () => html`
					<sl-button 
						class="clear-filters-button" 
						variant="default" 
						pill 
						@click=${this.clearAllFilters} 
						?disabled=${!this.filtersApplied}
					>
						<sl-icon slot="prefix" name="funnel"></sl-icon>
						Clear filters
					</sl-button>
				`)}
			</div>
			<div class="table-wrapper">
				<div class="table">
					<slot></slot>
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
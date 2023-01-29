import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { Subject, Subscription, timer, debounce } from 'rxjs'
import { SearchParams } from '../../types/search.type'
import { appTableActionsBoxStyle, appTableStyle } from '../../styles/app-table.style'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js'

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

	@property({ type: Boolean, reflect: true })
	loading = false

	@property({ type: String, attribute: 'search-value' })
	searchValue = ''

	@property({ type: Boolean, attribute: 'filters-applied' })
	filtersApplied = false

	#searchParams: SearchParams = { }

	#searchEvent = new Subject<string>()

	#searchSubscription: Subscription = new Subscription()

	connectedCallback() {
		super.connectedCallback()
		this.#searchSubscription = this.#searchEvent
			.asObservable()
			.pipe(debounce((value) => value ? timer(300) : timer(0)))
			.subscribe((value) => {
				if (value) {
					this.#searchParams.search = value
				} else {
					delete this.#searchParams.search
				}
				this.filtersApplied = this.hasFiltersApplied()
				this.#dispatchFilterEvent()
			})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#searchSubscription.unsubscribe()
	}

    firstUpdated() {
        this.addEventListener('app-table-column-filter', (event) => {
            const { field, value, order } = (<CustomEvent>event).detail
            if (value) {
                this.#searchParams[field] = value
            } else {
                delete this.#searchParams[field]
            }
            if (order) {
                this.#searchParams['sort'] = field
                this.#searchParams['order'] = order
            } else {
                delete this.#searchParams['sort']
                delete this.#searchParams['order']
            }
            this.filtersApplied = this.hasFiltersApplied()
            this.#dispatchFilterEvent()
        })
    }

	#dispatchFilterEvent() {
        this.dispatchEvent(new CustomEvent('app-table-filter', {
            bubbles: true,
            composed: true,
            detail: this.#searchParams
        }))
	}

	search(value: string) {
		this.#searchEvent.next(value)
	}

    hasFiltersApplied() {
        return Object.keys(this.#searchParams).length > 0
    }

	clearAllFilters() {
		this.filtersApplied = false
		this.#searchParams = {}
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
		const slot = this.renderRoot.querySelector('.table slot')
		const head = (<HTMLSlotElement>slot).assignedElements().filter((node) => node.matches('app-table-head'))[0]
		return head?.querySelectorAll('app-table-heading')
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
                        @sl-input=${(event: CustomEvent) => this.search((<SlInput>event.target).value)}
                    >
                        <sl-icon name="search" slot="prefix"></sl-icon>
                    </sl-input>
                `)}
				<div class="action-buttons">
					<slot name="actions"></slot>
				</div>
				${when(this.clearable, () => html`
					<sl-button class="clear-filters-button" variant="default" pill @click=${this.clearAllFilters} ?disabled=${!this.filtersApplied}>
						<sl-icon slot="prefix" name="funnel"></sl-icon>
						Clear filters
					</sl-button>
				`)}
			</div>
			<div class="table-wrapper">
				<div class="table">
					<sl-spinner ?hidden=${!this.loading}></sl-spinner>
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
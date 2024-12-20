import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { AppPaginateEvent } from '@app/events/pagination.event'
import '@app/elements/button/app-button.element'
import '@app/elements/icon/app-icon.element'

@customElement('app-paginator')
export class AppPaginator extends LitElement {
	static styles = css`
		:host {
			display: flex;
			align-items: center;
			gap: 10px;
		}
	`

	@property({ type: Number })
	accessor total = 0

	@property({ type: Number, attribute: 'page-index' })
	accessor pageIndex = 0

	@property({ type: Number, attribute: 'page-size' })
	accessor pageSize = 5

	@property({ type: Array })
	accessor pageSizeOptions = [5, 10, 20]

	private previousPageIndex = 0

	private pageSizeChange(event: Event) {
		const value = (<HTMLSelectElement>event.target).value
		const pageSize = parseInt(value.toString())
		const startIndex = this.pageIndex * this.pageSize
		this.previousPageIndex = this.pageIndex
		this.pageIndex = Math.floor(startIndex / pageSize) || 0
		this.pageSize = pageSize
		this.emitPageEvent()
	}

	reset() {
		this.pageIndex = 0
	}

	hasPreviousPage() {
		return this.pageIndex >= 1 && this.pageSize != 0
	}

	hasNextPage() {
		const maxPageIndex = this.getNumberOfPages() - 1
		return this.pageIndex < maxPageIndex && this.pageSize != 0
	}

	getNumberOfPages() {
		return Math.ceil(this.total / this.pageSize)
	}

	private firstPage() {
		if (!this.hasPreviousPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = 0
		this.emitPageEvent()
	}

	private lastPage() {
		if (!this.hasNextPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = this.getNumberOfPages() - 1
		this.emitPageEvent()
	}

	private nextPage() {
		if (!this.hasNextPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = this.pageIndex + 1
		this.emitPageEvent()
	}

	private previousPage() {
		if (!this.hasPreviousPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = this.pageIndex - 1
		this.emitPageEvent()
	}

	private getRangeLabel() {
		if (this.total == 0 || this.pageSize == 0) return `0 of ${this.total}`
		const startIndex = this.pageIndex * this.pageSize
		const endIndex = startIndex < this.total ? Math.min(startIndex + this.pageSize, this.total) : startIndex + this.pageSize
		return `${startIndex + 1} - ${endIndex} of ${this.total}`
	}

	emitPageEvent() {
		this.dispatchEvent(
			new AppPaginateEvent({
				pageSize: this.pageSize,
				pageIndex: this.pageIndex,
				previousPageIndex: this.previousPageIndex,
				total: this.total,
			})
		)
	}

	render() {
		return html`
			<label for="page-size">
				Items per page:
				<select id="page-size" @change=${this.pageSizeChange}>
					${this.pageSizeOptions.map(
						(value) => html`<option value=${value?.toString()} ?selected=${this.pageSize === value}>${value}</option>`
					)}
				</select>
			</label>
			${this.getRangeLabel()}
			<app-button variant="primary" icon title="First" @click=${this.firstPage} ?disabled=${!this.hasPreviousPage()}>
				<app-icon name="angles-left"></app-icon>
			</app-button>
			<app-button variant="primary" icon title="Previous" @click=${this.previousPage} ?disabled=${!this.hasPreviousPage()}>
				<app-icon name="angle-left"></app-icon>
			</app-button>
			<app-button variant="primary" icon title="Next" @click=${this.nextPage} ?disabled=${!this.hasNextPage()}>
				<app-icon name="angle-right"></app-icon>
			</app-button>
			<app-button variant="primary" icon title="Last" @click=${this.lastPage} ?disabled=${!this.hasNextPage()}>
				<app-icon name="angles-right"></app-icon>
			</app-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-paginator': AppPaginator
	}
}

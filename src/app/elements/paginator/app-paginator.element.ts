import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.js'
import { SlChangeEvent } from '@shoelace-style/shoelace'

@customElement('app-paginator')
export class AppPaginator extends LitElement {
	static styles = css`
		:host {
			display: flex;
			align-items: center;
		}

		sl-icon-button {
			font-size: 1.5rem;
		}

		sl-select {
			margin: 0 10px;
			width: 75px;
		}
	`

	@property({ type: Number })
	total = 0

	@property({ type: Number, reflect: true })
	pageIndex = 0

	@property({ type: Number, reflect: true })
	pageSize = 5

	@property({ type: Array })
	pageSizeOptions = [5, 10, 20]

	private previousPageIndex = 0

	private pageSizeChange(event: SlChangeEvent) {
		const value = (<SlSelect>event.target).value
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
			new CustomEvent('app-paginate', {
				bubbles: true,
				composed: true,
				detail: {
					pageSize: this.pageSize,
					pageIndex: this.pageIndex,
					previousPageIndex: this.previousPageIndex,
					total: this.total,
				},
			})
		)
	}

	render() {
		return html`
			Items per page:
			<sl-select pill filled value=${this.pageSize} size="small" @sl-change=${this.pageSizeChange}>
				${this.pageSizeOptions.map((value) => html`<sl-option value=${value?.toString()}>${value}</sl-option>`)}
			</sl-select>
			${this.getRangeLabel()}
			<sl-icon-button
				name="chevron-bar-left"
				label="First"
				title="First"
				@click=${this.firstPage}
				?disabled=${!this.hasPreviousPage()}
			>
			</sl-icon-button>
			<sl-icon-button
				name="chevron-left"
				label="Previous"
				title="Previous"
				@click=${this.previousPage}
				?disabled=${!this.hasPreviousPage()}
			>
			</sl-icon-button>
			<sl-icon-button
				name="chevron-right"
				label="Next"
				title="Next"
				@click=${this.nextPage}
				?disabled=${!this.hasNextPage()}
			>
			</sl-icon-button>
			<sl-icon-button 
				name="chevron-bar-right" 
				label="Last" 
				title="Last" 
				@click=${this.lastPage}
				?disabled=${!this.hasNextPage()}
			>
			</sl-icon-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-paginator': AppPaginator
	}
}

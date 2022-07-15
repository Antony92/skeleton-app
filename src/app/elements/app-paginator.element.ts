import { html, LitElement, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'

@customElement('app-paginator')
export class AppPaginator extends LitElement {
	static styles = css`
		:host {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			align-content: center;
		}

		sl-icon-button {
			font-size: 1.5rem;
		}

		sl-select {
			margin: 0 10px;
		}
	`

	@property({ type: Number })
	length = 0

	@property({ type: Number, reflect: true })
	limit = 10

	@property({ type: Array })
	itemsPerPageOptions = [10, 15, 20]

	@query('sl-select') 
	select!: HTMLElementTagNameMap['sl-select'] 

	@state()
	private skip = 0

	override firstUpdated() {
		this.select.addEventListener('sl-change', (event) => {
			this.limit = parseInt(this.select.value?.toString())
			if ((this.limit + this.skip) > this.length) this.skip = this.length - this.limit
			this.sendEvent()
		})
	}

	paginate(skip = 0) {
		this.skip += skip
		if (this.skip < 0) this.skip = 0
		if ((this.limit + this.skip) > this.length) this.skip = this.length - this.limit
		this.sendEvent()
	}

	sendEvent() {
		this.dispatchEvent(new CustomEvent('app-paginate', { 
			bubbles: true, 
			composed: true, 
			detail: { 
				limit: this.limit,
				skip: this.skip,
				length: this.length
			}
		}))
	}

	override render() {
		return html`
			Items per page:  
			<sl-select value=${this.limit} size="small">
				${this.itemsPerPageOptions.map(value => html`<sl-menu-item value=${value}>${value}</sl-menu-item>`)}
            </sl-select>
			${this.skip + (this.length > 0 ? 1 : 0)} - ${this.length > 0 ? this.skip + this.limit : 0} of ${this.length}
			<sl-icon-button 
				library="material" 
				name="first_page" 
				label="First" 
				title="First"
				@click=${() => {
					this.skip = 0
					this.paginate(0)
				}}
				?disabled=${this.skip === 0 || this.length === 0}>
			</sl-icon-button>
			<sl-icon-button 
				library="material" 
				name="navigate_before" 
				label="Next" 
				title="Previous"
				@click=${() => this.paginate(-this.limit)} 
				?disabled=${this.skip === 0 || this.length === 0}>
			</sl-icon-button>
			<sl-icon-button 
				library="material" 
				name="navigate_next" 
				label="Next" 
				title="Next"
				@click=${() => this.paginate(this.limit)} 
				?disabled=${this.skip === this.length - this.limit || this.length === 0}>
			</sl-icon-button>
			<sl-icon-button 
				library="material" 
				name="last_page" 
				label="Last" 
				title="Last"
				@click=${() => {
					this.skip = 0
					this.paginate(this.length - this.limit)
				}} 
				?disabled=${this.skip === this.length - this.limit || this.length === 0}>
			</sl-icon-button>
		`
	}
}

declare global {
    interface HTMLElementTagNameMap {
        'app-paginator': AppPaginator;
    }
}
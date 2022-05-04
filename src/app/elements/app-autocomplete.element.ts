import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { debounceTime, fromEvent, map, startWith, switchMap } from 'rxjs'
import { searchForProducts } from '../services/api.service'

@customElement('app-autocomplete')
export class AppAutocomplete extends LitElement {
	static styles = css``

	@query('#search')
	searchInput!: HTMLInputElement

	@state()
	private products = []

	protected firstUpdated() {
		fromEvent(this.searchInput, 'keyup')
			.pipe(
				startWith(''),
				debounceTime(300),
				map(() => this.searchInput.value),
				switchMap((value) => searchForProducts(value))
			)
			.subscribe((products) => (this.products = products))
	}

    private selected(product: any) {
        this.searchInput.value = product.title
        this.dispatchEvent(new CustomEvent('app-search', { bubbles: true, composed: true, detail: product }))
    }

	protected render() {
		return html`
			<label for="search">Search</label>
			<input type="text" id="search" />
			<ul>
				${this.products.map((product: any) => html`<li @click=${() => this.selected(product)}>${product.title}</li>`)}
			</ul>
		`
	}
}

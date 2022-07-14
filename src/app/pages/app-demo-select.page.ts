import { html, LitElement, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import { getProducts } from '../services/api.service'

@customElement('app-demo-select')
export class AppDemoSelect extends LitElement {
	static styles = css`
		sl-select {
			width: 300px;
		}
	`

	@state()
	private products = []

	@query('#select-single')
  	selectSingle!: HTMLElementTagNameMap['sl-select']

	@query('#select-multiple')
  	selectMultiple!: HTMLElementTagNameMap['sl-select']

	override connectedCallback() {
		super.connectedCallback()
		this.loadProducts()
	}

	override firstUpdated() {
		this.selectSingle.addEventListener('sl-change', (event: Event) => {
			console.log('single selected value:', this.selectSingle.value)
		})
		this.selectMultiple.addEventListener('sl-change', (event: Event) => {
			console.log('multiple selected value:', this.selectMultiple.value)
		})
	}

	async loadProducts() {
		this.products = await getProducts()
	}

	override render() {
		return html`
			<sl-select id="select-single" name="animal" label="Product" placeholder="Select one" clearable>
				${this.products.map((product: any) => html`<sl-menu-item value="${product.title}">${product.title}</sl-menu-item>`)}
            </sl-select>
			<br/><br/>
            <sl-select id="select-multiple" name="animal" label="Products" placeholder="Select multiple" clearable multiple>
				${this.products.map((product: any) => html`<sl-menu-item value="${product.title}">${product.title}</sl-menu-item>`)}
            </sl-select>
		`
	}
}

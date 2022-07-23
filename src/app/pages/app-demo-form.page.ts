import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import { getProducts } from '../services/api.service'

@customElement('app-demo-form')
export class AppDemoForm extends LitElement {
	static styles = css``

	@state()
	private products = []

	@query('form') 
	form!: HTMLFormElement

	@query('sl-select[name="product"]')
	productSelect!: HTMLElementTagNameMap['sl-select']

	@query('sl-select[name="products"]')
	productsSelect!: HTMLElementTagNameMap['sl-select']

	override connectedCallback() {
		super.connectedCallback()
		this.loadProducts()
	}

	override firstUpdated() {
		this.form.addEventListener('submit', (event) => {
			event.preventDefault()
			const json = serialize(this.form)
			console.log(json)
		})
	}

	async loadProducts() {
		this.products = await getProducts()
	}

	override render() {
		return html`
			<form>
				<sl-input name="name" label="Name" required></sl-input>
				<br />
				<sl-select name="product" label="Favorite product" clearable required>
					${this.products.map((product: any) => html`<sl-menu-item value=${product.title}>${product.title}</sl-menu-item>`)}
				</sl-select>
				<br />
				<sl-select name="products" label="Favorite products" clearable required multiple>
					${this.products.map((product: any) => html`<sl-menu-item value=${product.title}>${product.title}</sl-menu-item>`)}
				</sl-select>
				<br />
				<sl-textarea name="comment" label="Comment" required></sl-textarea>
				<br />
				<sl-checkbox name="check" required>Check me before submitting</sl-checkbox>
				<br /><br />
				<sl-button type="submit" variant="primary">Submit</sl-button>
				<sl-button type="reset" variant="neutral">Clear</sl-button>
			</form>
		`
	}
}

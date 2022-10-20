import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import { getProducts } from '../services/api.service'

@customElement('app-demo-form')
export class AppDemoForm extends LitElement {
	static styles = css`
		sl-input, sl-select, sl-textarea {
			width: 300px;
		}
	`

	@state()
	private products: any[] = []

	@query('form') 
	form!: HTMLFormElement

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
				<sl-input name="name" label="Name" placeholder="Enter your name" required clearable></sl-input>
				<br />
				<sl-input type="email" name="email" label="Email" placeholder="Enter your email" required clearable></sl-input>
				<br />
				<sl-input type="date" name="date" label="Date" placeholder="Enter date" required clearable></sl-input>
				<br />
				<sl-input type="number" name="number" label="Number" placeholder="Enter number" required clearable></sl-input>
				<br />
				<sl-select name="product" label="Favorite product" placeholder="Select one product" clearable required>
					${this.products.map((product: any) => html`<sl-menu-item value="${product.title}">${product.title}</sl-menu-item>`)}
				</sl-select>
				<br />
				<sl-select name="products" label="Favorite products" placeholder="Select multiple products" clearable required multiple>
					${this.products.map((product: any) => html`<sl-menu-item value="${product.title}">${product.title}</sl-menu-item>`)}
				</sl-select>
				<br />
				<sl-textarea name="comment" label="Comment" placeholder="Add comment" required></sl-textarea>
				<br />
				<sl-checkbox name="check" required>Check me before submitting</sl-checkbox>
				<br /><br />
				<sl-button type="submit" variant="primary">Submit</sl-button>
				<sl-button type="reset" variant="neutral">Clear</sl-button>
			</form>
		`
	}
}

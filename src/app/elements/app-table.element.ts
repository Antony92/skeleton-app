import { html, LitElement, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { getProducts } from '../services/api.service'

@customElement('app-table')
export class AppTable extends LitElement {
	static styles = css`
		table {
			border-collapse: collapse;
			width: 100%;
		}

		td,
		th {
			border: 1px solid #dddddd;
			text-align: left;
			padding: 8px;
		}

		tr:nth-child(even) {
			background-color: #dddddd;
		}
	`
	
	@property({ type: Boolean })
	refresh = false

	@state()
	private products = []

	connectedCallback() {
		super.connectedCallback()
		this.loadProducts()
	}

	private async loadProducts() {
		this.products = await getProducts()
	}

	private deleteElement(index: number) {
		this.products.splice(index, 1)
		this.requestUpdate()
	}

	protected render() {
		return html`
			<table>
				<tr>
					<th>Product</th>
					<th>Brand</th>
					<th>Price</th>
					<th></th>
				</tr>
				${this.products.map(
					(product: any, index) => html`
					<tr>
						<td>${product.title}</td>
						<td>${product.brand}</td>
						<td>${product.price}</td>
						<td><button @click=${() => this.deleteElement(index)}>Delete</button></td>
					</tr>`
				)}
			</table>
			<button ?hidden=${!this.refresh} @click=${() => this.loadProducts()}>Refresh</button>
		`
	}
}

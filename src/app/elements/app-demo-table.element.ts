import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { getUsers } from '../services/api.service'

@customElement('app-demo-table')
export class AppDemoTable extends LitElement {
    static styles = css`
        table {
            width: 100%;
            border-collapse: collapse;
        }

        table thead th, table tbody td {
            text-align: left;
            border-bottom: 1px solid grey;
        }

        table th, table td {
            padding: 10px;
        }

        table tbody tr:hover {
            background-color: dimgrey;
        }
    `

    @state()
	private users: any = null

    private skip = 0

    private columns = [
        'Id',
        'Email',
        'Username',
        'Address',
        'IP',
    ]

    override connectedCallback() {
        super.connectedCallback()
        this.loadUsers()
    }

    async loadUsers(skip = 0) {
        this.skip += skip
        this.users = await getUsers(this.skip)
    }

	override render() {
		return html`
            <table>
                <thead>
                    <tr>
                        ${this.columns.map(column => html`<th>${column}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${this.users?.users?.map((user: any) => html`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.email}</td>
                            <td>${user.username}</td>
                            <td>${user.address.address}</td>
                            <td>${user.ip}</td>
                        </tr>
                    `)}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="${this.columns.length}">
                            <sl-button variant="text" size="small" @click=${() => this.loadUsers(-10)} ?disabled=${this.skip === 0}>Previous</sl-button>
                            <sl-button variant="text" size="small" @click=${() => this.loadUsers(10)} ?disabled=${this.skip === this.users?.total - 10}>Next</sl-button>
                            Total: ${this.users?.total}  
                        </td>
                    </tr>
                </tfoot>
            </table>
		`
	}
    
}
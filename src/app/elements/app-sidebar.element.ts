import { html, LitElement, css } from 'lit'
import { customElement, queryAll } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = css`
		nav {
			display: flex;
			width: 260px;
			height: 100%;
    		border-right: solid 1px var(--sl-color-neutral-200);
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 10px 0;
			width: 100%;
		}

		ul li {
			width: 100%;
		}

		ul li a {
			display: flex;
			align-items: center;
			color: var(--sl-color-neutral-1000);
			text-decoration: none;
			margin: 10px 15px;
			padding: 15px 0;
			transition: 300ms;
			border-radius: 3px;
			cursor: pointer;
		}

		ul li a.active {
			box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(0 0 0 / 40%);
			background: #0284c7;
			color: white;
		}

		ul li a:hover {
			box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(0 0 0 / 40%);
			background: #0284c7;
			color: white;
		}

		ul li a span {
			display: inline-block;
			white-space: nowrap;
			overflow: hidden;
		}

		ul li a sl-icon {
			margin: 0 20px;
		}

	`

	@queryAll('a')
  	links!: NodeListOf<HTMLLinkElement>;

	override firstUpdated() {
		const path = location.pathname.split('/')[1]
		if (path) {
			this.shadowRoot?.querySelector(`a[href="/${path}"]`)?.classList.add('active')
		} else {
			this.shadowRoot?.querySelector(`a[href="/"]`)?.classList.add('active')
		}
		this.links.forEach(link => {
			link.addEventListener('click', () => {
				const activeLink = this.shadowRoot?.querySelector('a.active')
				activeLink?.classList.remove('active')
				link.classList.add('active')
			})
		})
	}

	override render() {
		return html`
			<nav>
				<ul>
					<li>
						<a href="/">
							<sl-icon name="house-door-fill"></sl-icon>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a variant="text" href="/form">
							<sl-icon name="postcard-fill"></sl-icon>
							<span>Form</span>
						</a>
					</li>
					<li>
						<a variant="text" href="/alerts">
							<sl-icon name="exclamation-square-fill"></sl-icon>
							<span>Alerts</span>
						</a>
					</li>
					<li>
						<a variant="text" href="/table">
							<sl-icon name="table"></sl-icon>
							<span>Table</span>
						</a>
					</li>
				</ul>
			</nav>
		`
	}
}

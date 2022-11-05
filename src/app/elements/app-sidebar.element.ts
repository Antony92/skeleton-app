import { html, LitElement, css } from 'lit'
import { customElement, queryAll } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = css`
		nav {
			display: flex;
			width: 90px;
			height: 100%;
    		border-right: solid 1px var(--sl-color-neutral-200);
		}

		ul {
			display: flex;
			flex-direction: column;
			list-style: none;
			padding: 0;
			margin: 10px 0;
			width: 100%;
		}

		ul li {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 5px;
			width: 100%;
		}

		ul li a {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: var(--sl-color-neutral-700);
			text-decoration: none;
			cursor: pointer;
			margin-bottom: 20px;
		}

		ul li a:hover sl-icon, ul li a.active sl-icon {
			box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(0 0 0 / 40%);
			background: #0284c7;
			color: white;
		}

		ul li a.active span {
			color: white
		}

		ul li a span {
			font-size: 12px;
		}

		ul li a sl-icon {
			padding: 10px 20px;
			transition: 300ms;
			border-radius: 20px;
			margin-bottom: 5px;
		}

		@media only screen and (max-width: 800px) {
			
			nav {
				width: auto;
				border-right: none;
				border-top: solid 1px var(--sl-color-neutral-200);
			}

			ul {
				margin: 0;
				flex-direction: row;
				overflow: auto;
				width: 100vw;
			}

			ul li a {
				margin: 10px 0px;
			}
		}

	`

	@queryAll('a')
  	links!: NodeListOf<HTMLLinkElement>;

	override firstUpdated() {
		const path = location.pathname.split('/')[1]
		this.renderRoot.querySelector(`a[href="/${path}"]`)?.classList.add('active')
		this.links.forEach(link => {
			link.addEventListener('click', () => {
				const activeLink = this.renderRoot.querySelector('a.active')
				activeLink?.classList.remove('active')
				link.classList.add('active')
			})
		})
		// navigation.addEventListener('navigate', (navigateEvent) => console.log(navigateEvent))
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
						<a href="/form">
							<sl-icon name="postcard-fill"></sl-icon>
							<span>Form</span>
						</a>
					</li>
					<li>
						<a href="/alerts">
							<sl-icon name="exclamation-square-fill"></sl-icon>
							<span>Alerts</span>
						</a>
					</li>
					<li>
						<a href="/table">
							<sl-icon name="table"></sl-icon>
							<span>Table</span>
						</a>
					</li>
				</ul>
			</nav>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-sidebar': AppSidebar
	}
}
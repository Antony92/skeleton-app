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
			background-color: var(--sl-color-neutral-50);
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
			gap: 5px;
			color: var(--sl-color-neutral-700);
			text-decoration: none;
			cursor: pointer;
			margin-bottom: 20px;
		}

		ul li a span:first-child {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 56px;
    		height: 32px;
			border-radius: 16px;
			transition: all 300ms;
		}

		ul li a span:first-child sl-icon {
			font-size: 20px;
			transition: scale 300ms;
		}

		ul li a.active span:first-child {
			box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(0 0 0 / 40%);
			background: var(--sl-color-sky-600);
			color: var(--sl-color-neutral-0);
		}

		ul li a:hover:not(.active) span:first-child {
			background: var(--sl-color-neutral-300);
		}

		ul li a:hover span:first-child sl-icon {
			scale: 1.1;
		}

		ul li a span:nth-child(2) {
			font-size: 12px;
		}

		ul li a.active span:nth-child(2) {
			color: var(--sl-color-sky-600);
		}

		@media only screen and (max-width: 800px) {
			
			nav {
				width: auto;
				border-right: none;
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
							<span>
								<sl-icon name="house-door-fill"></sl-icon>
							</span>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a href="/form">
							<span>
								<sl-icon name="postcard-fill"></sl-icon>
							</span>
							<span>Form</span>
						</a>
					</li>
					<li>
						<a href="/alerts">
							<span>
								<sl-icon name="exclamation-square-fill"></sl-icon>
							</span>
							<span>Alerts</span>
						</a>
					</li>
					<li>
						<a href="/table">
							<span>
								<sl-icon name="table"></sl-icon>
							</span>
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
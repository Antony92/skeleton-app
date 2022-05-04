import { Router } from '@lit-labs/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import './elements/app-sidebar.element'
import './elements/app-theme-switch.element'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = css`
		.container {
			height: 100vh;
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto 1fr;
			grid-template-areas:
				'sidebar main';
		}

		.main {
			grid-area: main;
			overflow: auto;
			display: grid;
			justify-content: center;
			padding-top: 10px;
		}

		.sidebar {
			grid-area: sidebar;
			z-index: 4;
		}

		app-theme-switch {
			position: absolute;
			right: 10px;
			top: 10px;
			z-index: 10;
		}
	`

	private router = new Router(this, [
		{ path: '/', render: () => html`<h1>Welcome Lit</h1>` },
		{
			path: '/showcase/:component',
			render: ({ component }) => html`<app-showcase component="${component}"></app-showcase>`,
			enter: async () => {
				await import('./elements/app-showcase.element')
				return true
			},
		},
		{ path: '/*', render: () => html`<h1>Not found</h1>` },
	])

	override render() {
		return html`
			<app-theme-switch></app-theme-switch>
			<div class="container">
				<app-sidebar class="sidebar"></app-sidebar>
				<main class="main">${this.router.outlet()}</main>
			</div>
		`
	}
}

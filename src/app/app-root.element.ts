import { Router } from '@lit-labs/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import './elements/app-header.element'
import './elements/app-sidebar.element'
import './elements/app-global-message.element'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = css`
		.container {
			height: 100vh;
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto 1fr;
			grid-template-areas:
				"header header"
				"sidebar main";
		}

		.main {
			grid-area: main;
			overflow: auto;
			display: grid;
			justify-content: center;
  			align-content: center;
		}

		.sidebar {
			grid-area: sidebar;
			z-index: 4;
		}

		.header {
			grid-area: header;
			z-index: 5;
		}
	`

	private router = new Router(this, [
		{ path: '/', render: () => html`<img alt="Home image of an astronaut" src="assets/images/astro.svg"/>` },
		{
			path: '/form',
			render: () => html`<app-demo-form></app-demo-form>`,
			enter: async () => {
				await import('./pages/app-demo-form.page')
				return true
			},
		},
		{
			path: '/alerts',
			render: () => html`<app-demo-alerts></app-demo-alerts>`,
			enter: async () => {
				await import('./pages/app-demo-alerts.page')
				return true
			},
		},
		{
			path: '/table',
			render: () => html`<app-demo-table></app-demo-table>`,
			enter: async () => {
				await import('./pages/app-demo-table.page')
				return true
			},
		},
		{ path: '/*', render: () => html`<img alt="Not found 404" src="assets/images/page-not-found.svg"/>` },
	])

	override render() {
		return html`
			<div class="container">
				<app-header appTitle="Application" class="header"></app-header>
				<app-sidebar class="sidebar"></app-sidebar>
				<main class="main">${this.router.outlet()}</main>
				<app-global-message></app-global-message>
			</div>
		`
	}
}

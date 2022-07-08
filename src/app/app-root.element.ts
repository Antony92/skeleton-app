import { Router } from '@lit-labs/router'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import './elements/app-sidebar.element'
import './elements/app-theme.element'

@customElement('app-root')
export class AppRoot extends LitElement {
	static styles = css`
		.container {
			height: 100vh;
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto-fill;
			grid-template-areas:
				'sidebar main';
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
			width: 260px;
    		border-right: 1px solid dimgrey;
		}

		app-theme {
			position: absolute;
			right: 25px;
			top: 10px;
			z-index: 10;
		}
	`

	private router = new Router(this, [
		{ path: '/', render: () => html`<img src="assets/images/astro.svg"/>` },
		{
			path: '/select',
			render: () => html`<app-demo-select></app-demo-select>`,
			enter: async () => {
				await import('./elements/app-demo-select.element')
				return true
			},
		},
		{
			path: '/form',
			render: () => html`<app-demo-form></app-demo-form>`,
			enter: async () => {
				await import('./elements/app-demo-form.element')
				return true
			},
		},
		{
			path: '/toast',
			render: () => html`<app-demo-toast></app-demo-toast>`,
			enter: async () => {
				await import('./elements/app-demo-toast.element')
				return true
			},
		},
		{
			path: '/confirm-dialog',
			render: () => html`<app-demo-confirm-dialog></app-demo-confirm-dialog>`,
			enter: async () => {
				await import('./elements/app-demo-confirm-dialog.element')
				return true
			},
		},
		{
			path: '/table',
			render: () => html`<app-demo-table></app-demo-table>`,
			enter: async () => {
				await import('./elements/app-demo-table.element')
				return true
			},
		},
		{ path: '/*', render: () => html`<img src="assets/images/page-not-found.svg"/>` },
	])

	override render() {
		return html`
			<div class="container">
				<app-sidebar class="sidebar"></app-sidebar>
				<main class="main">${this.router.outlet()}</main>
				<app-theme></app-theme>
			</div>
		`
	}
}

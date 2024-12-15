import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-loader')
export class AppLoader extends LitElement {
	static styles = css`
		:host {
			position: fixed;
			width: 100vw;
			height: 100vh;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			display: grid;
			cursor: progress;
		}

		.loader-line {
			width: 100vw;
			height: 3px;
			position: relative;
			overflow: hidden;
			background-color: var(--theme-default-color);

			&::after {
				content: '';
				position: absolute;
				left: -50%;
				height: 3px;
				width: 40%;
				background-color: var(--theme-primary-color);
				animation: line 1s linear infinite;
			}
		}

		@keyframes line {
			0% {
				left: -40%;
			}

			50% {
				left: 20%;
				width: 80%;
			}

			100% {
				left: 100%;
				width: 100%;
			}
		}
	`

	render() {
		return html`<div class="loader-line"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-loader': AppLoader
	}
}

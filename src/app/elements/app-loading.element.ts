import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'

@customElement('app-loading')
export class AppLoading extends LitElement {
	static styles = css`
		:host {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
            display: grid;
            align-items: center;
            justify-items: center;
		}

        sl-spinner {
            font-size: 3rem;
        }
	`

	override render() {
		return html`<sl-spinner></sl-spinner>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-loading': AppLoading
	}
}

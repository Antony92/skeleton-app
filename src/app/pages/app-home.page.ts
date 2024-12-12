import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-home')
export class AppHome extends LitElement {
	static styles = [
		css`
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        `
	]

    protected firstUpdated() {
    }

	render() {
		return html`Home`
            
	}
}

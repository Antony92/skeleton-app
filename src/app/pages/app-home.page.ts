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

	render() {
		return html`<img alt="Home image of an astronaut" src="assets/images/astro.svg" />`
	}
}

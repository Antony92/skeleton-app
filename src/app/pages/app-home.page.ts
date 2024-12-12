import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/dialog/app-dialog.element'

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
        this.renderRoot.querySelector('app-dialog')?.show()
    }

	render() {
		return html`<app-dialog light-dismiss header="Confirmation">
            <div>asdada</div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </app-dialog>`
            
	}
}

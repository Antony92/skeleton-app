import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@app/elements/snackbar/app-snackbar.element'
import { iconStyle, twitterIcon } from '@app/styles/icon.style'
import { globalMessage } from '@app/shared/global-message'

@customElement('app-home')
export class AppHome extends LitElement {
	static styles = [
        iconStyle,
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
		return html`<i class="icon" @click=${() => globalMessage('hello')}>${twitterIcon}</i>`
            
	}
}

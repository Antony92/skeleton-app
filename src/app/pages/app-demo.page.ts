import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { faMagnifyingGlassIcon, iconStyle } from '@app/styles/icon.style'
import { buttonStyle } from '@app/styles/button.style'
import { globalMessage } from '@app/shared/global-message'

@customElement('app-demo')
export class AppDemo extends LitElement {
	static styles = [
		buttonStyle,
		iconStyle,
		css`
            :host {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

			fieldset {
				display: flex;
                flex-wrap: wrap;
				gap: 10px;
				border-radius: var(--radius-2);
			}
		`,
	]

	protected firstUpdated() {}

	render() {
		return html`
			Demo
			<fieldset>
				<legend>Buttons</legend>
				<button class="primary">Primary</button>
				<button class="default">Secondary</button>
				<button class="success">Success</button>
				<button class="warning">Warning</button>
				<button class="error">Error</button>
				<button class="primary" disabled>Disabled</button>
				<button class="primary">
					<i class="icon">${faMagnifyingGlassIcon}</i>
					Right icon
				</button>
				<button class="primary">
					Left icon
					<i class="icon">${faMagnifyingGlassIcon}</i>
				</button>
				<button class="primary only-text">Only text</button>
				<button class="primary only-icon">
					<i class="icon">${faMagnifyingGlassIcon}</i>
				</button>
			</fieldset>

			<fieldset>
				<legend>Global messages</legend>
				<button class="primary" @click=${() => globalMessage('This is info', 'info')}>Info</button>
                <button class="warning" @click=${() => globalMessage('This is warning', 'warning')}>Warning</button>
                <button class="error" @click=${() => globalMessage('This is error', 'error')}>Error</button>
			</fieldset>
		`
	}
}

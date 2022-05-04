import { html, LitElement, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('app-form')
export class AppForm extends LitElement {
	static styles = css``

    @state()
    private formDataString: string = ''

    private handleFormChange(event: Event) {
        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const json = Object.fromEntries(formData)
        this.formDataString = JSON.stringify(json)
        this.dispatchEvent(new CustomEvent('app-form-change', { bubbles: true, composed: true, detail: json }))
    }

	protected render() {
		return html`
            <form @change=${(event: Event) => this.handleFormChange(event)}>
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name">
                <br><br>
                <label for="cars">Choose a car:</label>
                <select id="cars" name="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="fiat">Fiat</option>
                    <option value="audi">Audi</option>
                </select>
                <br><br>
                <label for="message">Message:</label><br>
                <textarea id="message" name="message"></textarea>
            </form>
            <br>
            <code>
                ${this.formDataString}
            </code>
        `
	}
}

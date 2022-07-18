import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'

@customElement('app-demo-form')
export class AppDemoForm extends LitElement {
	static styles = css``

	@query('form') form!: HTMLFormElement

	constructor() {
		super()
	}

	override firstUpdated() {
		this.form.addEventListener('submit', (event) => {
			event.preventDefault()
			const json = serialize(this.form)
			console.log(json)
		})
	}

	override render() {
		return html`
			<form>
				<sl-input name="name" label="Name" required></sl-input>
				<br />
				<sl-select name="animal" label="Favorite Animal" clearable required>
					<sl-menu-item value="birds">Birds</sl-menu-item>
					<sl-menu-item value="cats">Cats</sl-menu-item>
					<sl-menu-item value="dogs">Dogs</sl-menu-item>
					<sl-menu-item value="other">Other</sl-menu-item>
				</sl-select>
				<br />
				<sl-textarea name="comment" label="Comment" required></sl-textarea>
				<br />
				<sl-checkbox name="check" required>Check me before submitting</sl-checkbox>
				<br /><br />
				<sl-button type="submit" variant="primary">Submit</sl-button>
			</form>
		`
	}
}

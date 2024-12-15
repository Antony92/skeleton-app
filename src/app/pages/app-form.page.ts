import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@app/elements/input/app-input.element'
import '@app/elements/button/app-button.element'
import { serializeForm } from '@app/utils/html'
import { formStyle } from '@app/styles/form.style'

@customElement('app-form')
export class AppForm extends LitElement {
	static styles = [
        formStyle,
		css`
            .actions {
                display: flex;
                justify-content: flex-start;
                gap: 10px;
            }
		`,
	]

    @query('form')
    form!: HTMLFormElement

	protected async firstUpdated() {
    }

    submit(event: SubmitEvent) {
        event.preventDefault()
        const data = serializeForm(this.form)
        console.log(data)
    }

	render() {
		return html`
            <form @submit=${this.submit}>
                <app-input required name="email" label="Email" type="email"></app-input>
                <div class="actions">
                    <app-button variant="primary" @click=${() => this.form.requestSubmit()}>Submit</app-button>
                    <app-button @click=${() => this.form.reset()}>Reset</app-button>
                </div>
            </form>
        `
	}
}

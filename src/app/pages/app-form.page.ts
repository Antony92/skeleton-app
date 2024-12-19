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

            /* app-input:state(invalid) {
                color: green;
            } */
		`,
	]

    @query('form')
    form!: HTMLFormElement

	protected async firstUpdated() {

        setTimeout(() => {
            // this.renderRoot.querySelector('input')!.value = 'asdasdasda'
        }, 5000)

        // this.renderRoot.querySelector('input')?.addEventListener('invalid', () => console.log('invalid'))
    }

    async submit(event: SubmitEvent) {
        event.preventDefault()
        if (!this.form.checkValidity()) {
            this.form.querySelector<HTMLElement>('*:state(invalid)')?.focus()
            return
        }
        const data = serializeForm(this.form)
        console.log(data)
    }

	render() {
		return html`
            <form @submit=${this.submit} novalidate>
                <app-input required name="test1" label="Name" type="email"></app-input>
                <!-- <input required name="test2" label="Name" type="email" @invalid=${() => console.log('invalid input')}> -->
                <div class="actions">
                    <app-button variant="primary" @click=${() => this.form.requestSubmit()}>Submit</app-button>
                    <app-button @click=${() => this.form.reset()}>Reset</app-button>
                </div>
            </form>
        `
	}
}

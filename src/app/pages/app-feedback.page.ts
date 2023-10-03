import { html, LitElement, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { appPageTitleStyle } from '../styles/main.style'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/rating/rating.js'
import { notify } from '../shared/notification'
import { formValidationStyle, basicFormStyle } from '../styles/form.style'
import { SlRating, serialize } from '@shoelace-style/shoelace'
import { submitFeedback } from '../services/feedback.service'
import { setDocumentTitle } from '../utils/html'

@customElement('app-feedback')
export class AppFeedback extends LitElement {
	static styles = [appPageTitleStyle, formValidationStyle, basicFormStyle, css``]

    @query('form')
	form!: HTMLFormElement

    @query('sl-rating')
	rating!: SlRating

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Feedback')
	}

    firstUpdated() {
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault()
			const data: any = serialize(this.form)
            const satisfaction = this.rating.value || 1
            const res = await submitFeedback({ satisfaction, message: data.message })
            if (res) {
                this.rating.value = 0
                this.form.reset()
				notify({ variant: 'success', message: res.message })
            }
        })
    }

	render() {
		return html`
			<h3 class="title">Feedback</h3>

			<form class="basic-form form-validation">
                Rate us <sl-rating label="Rating"></sl-rating>
				<sl-textarea
					name="message"
                    required
					maxlength="2000"
					label="Message"
					placeholder="Please type your feedback here"
				>
                </sl-textarea>
				<div class="form-actions">
					<sl-button type="submit" variant="primary">Submit</sl-button>
				</div>
			</form>
		`
	}
}

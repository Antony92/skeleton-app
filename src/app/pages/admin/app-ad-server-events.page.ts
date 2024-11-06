import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { appPageTitleStyle } from '@app/styles/main.style'
import '@shoelace-style/shoelace/dist/components/card/card.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { createServerEvent, deleteServerEvent, getServerEvents, updateServerEvent } from '@app/services/server-event.service'
import { notify } from '@app/shared/notification'
import { basicFormStyle, formValidationStyle } from '@app/styles/form.style'
import { SlDialog } from '@shoelace-style/shoelace'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { confirmDialog } from '@app/shared/dialog'
import { createButtonStyle } from '@app/styles/button.style'
import { when } from 'lit/directives/when.js'
import { setDocumentTitle } from '@app/utils/html'

@customElement('app-ad-server-events')
export class AppADServerEvents extends LitElement {
	static styles = [
		appPageTitleStyle,
		formValidationStyle,
		basicFormStyle,
		createButtonStyle,
		css`
			.container {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
			}

			sl-card {
				min-width: 300px;
			}

			sl-card [slot='header'] {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		`,
	]

	@query('.server-event-dialog')
	serverEventDialog!: SlDialog

	@query('.server-event-dialog form')
	serverEventDialogForm!: HTMLFormElement

	@state()
	serverEvents = {
		data: [] as any[],
		total: 0,
	}

	@state()
	selectedEvent: any = null

	connectedCallback() {
		super.connectedCallback()
		setDocumentTitle('Admin - Server Events')
		this.loadServerEvents()
	}

    firstUpdated() {
		this.serverEventDialog.addEventListener('sl-request-close', (event) => {
			if (event.detail.source === 'overlay') {
				event.preventDefault()
			}
		})
		this.serverEventDialog.addEventListener('sl-after-hide', (event) => {
			if (event.target === this.serverEventDialog) {
				this.serverEventDialogForm.reset()
				this.selectedEvent = null
			}
		})
		this.serverEventDialogForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			const data: any = serialize(this.serverEventDialogForm)
			let res = null
			if (this.selectedEvent) {
				res = await updateServerEvent({ id: this.selectedEvent.id, ...data })
			} else {
				res = await createServerEvent(data)
			}
			this.serverEventDialog.hide()
			if (res.data) {
				await this.loadServerEvents()
				notify({ variant: 'success', message: res.message })
			}	
		})
	}

	async loadServerEvents() {
		this.serverEvents = await getServerEvents()
	}

	getVariant(type: 'info' | 'warning' | 'error') {
		if (type === 'info') return 'neutral'
		if (type === 'warning') return 'warning'
		if (type === 'error') return 'danger'
		return 'neutral'
	}

	async deleteEvent(id: string) {
		const confirm = await confirmDialog('Confirm', `Are you sure you want to delete system event`)
		if (!confirm) return
		const res = await deleteServerEvent(id)
		if (res.data) {
			await this.loadServerEvents()
			notify({ variant: 'success', message: res.message })
		}
	}

	async openServerEventDialog(event?: any) {
		this.selectedEvent = event
		this.serverEventDialogForm.querySelector('sl-select')!.value = 'info'
		this.serverEventDialog.show()
	}

	render() {
		return html`
			<h3 class="title">Server events</h3>

			<sl-button pill class="create-button" variant="primary" @click=${() => this.openServerEventDialog()}>
				<sl-icon slot="prefix" name="plus"></sl-icon>
				Create event
			</sl-button>

			<div class="container">
				${this.serverEvents.data.map(
					(event, index) => html`
						<sl-card>
							<div slot="header">
								<sl-badge ?pulse=${index === 0} title=${index === 0 ? 'Active event' : ''} variant=${this.getVariant(event.type)}>${event.type}</sl-badge>
								<sl-dropdown class="actions">
									<sl-icon-button slot="trigger" name="gear" label="Actions" title="Actions"></sl-icon-button>
									<sl-menu>
										<sl-menu-item @click=${() => this.openServerEventDialog(event)}>Edit</sl-menu-item>
										<sl-menu-item @click=${() => this.deleteEvent(event.id)}>Delete</sl-menu-item>
									</sl-menu>
								</sl-dropdown>
							</div>
							${event.message}
						</sl-card>
					`
				)}
				${when(this.serverEvents.data.length === 0, () => html`No active server events found.`)}
			</div>

			<sl-dialog label="${this.selectedEvent ? 'Edit' : 'Create'} server event" class="server-event-dialog">
				<form class="basic-form form-validation">
					<sl-select
						required
						hoist
						clearable
						placeholder="Select type"
						name="type"
						.value=${this.selectedEvent?.type || 'info'}
					>
						<sl-option value="info">Info</sl-option>
						<sl-option value="warning">Warning</sl-option>
						<sl-option value="error">Error</sl-option>
					</sl-select>
					<sl-textarea
						name="message"
						required
						autofocus
						clearable
						maxlength="500"
						placeholder="Message"
						.value=${this.selectedEvent?.message || ''}
					></sl-textarea>
					<div class="form-actions">
						<sl-button type="submit" variant="primary">${this.selectedEvent ? 'Save' : 'Create'}</sl-button>
					</div>
				</form>
			</sl-dialog>
		`
	}
}

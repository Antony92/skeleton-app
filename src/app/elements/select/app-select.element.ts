import { html, LitElement, css } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { type FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { appSelectStyle } from '@app/elements/select/app-select.style'
import type { AppSelectOption } from '@app/elements/select-option/app-select-option.element'

@customElement('app-select')
export class AppSelect extends LitElement implements FormControl {
	static styles = [
		appSelectStyle,
		css`
			.container {
				position: relative;
			}

			#popover {
				display: none;
				position: absolute;
				border: 1px solid light-dark(var(--gray-4), var(--gray-8));
				background-color: var(--theme-default-layer);
				border-radius: var(--radius-2);
				overflow: auto;
				padding: 5px 0;
				margin: 0;
				width: 100%;

				&[open] {
					display: flex;
					flex-direction: column;
					z-index: var(--layer-5);
				}
			}
		`,
	]

	@property({ type: Boolean })
	required = false

	@property({ type: Boolean, reflect: true })
	disabled = false

	@property({ type: Boolean })
	autofocus = false

	@property({ type: Boolean })
	hidden = false

	@property({ type: String })
	name = ''

	@property({ type: String })
	label = ''

	@property({ type: String })
	autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	value: string = ''

	@property({ type: String })
	defaultValue = ''

	@property({ type: String })
	displayValue = ''

	@property({ type: String })
	placeholder: string | undefined

	@property({ type: Boolean })
	open = false

	@property({ type: Boolean })
	multiple = false

	@state()
	private errorMessage: string = ''

	@state()
	touched = false

	@query('#input')
	input!: HTMLInputElement

	@query('#trigger')
	trigger!: HTMLInputElement

	@query('#popover')
	popup!: HTMLElement

	@queryAssignedElements({ selector: 'app-select-option' })
	assignedOptions!: AppSelectOption[]

	private attachedOptions = new WeakSet<AppSelectOption>()

	static formAssociated = true
	formController!: FormControlController

	constructor() {
		super()
		this.formController = new FormControlController(this)
	}

	connectedCallback() {
		super.connectedCallback()
		this.addEventListener('invalid', async () => {
			this.touched = true
		})
		this.addEventListener('keydown', (event) => {
			if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) || !this.open) {
				return
			}

			event.preventDefault()

			const activeOptions = this.getSlottedOptions().filter((option) => !option.disabled)

			const currentIndex = activeOptions.findIndex((option) => option.tabIndex === 0)

			let newIndex = Math.max(0, currentIndex)

			if (event.key === 'ArrowDown') {
				newIndex = currentIndex + 1 > activeOptions.length - 1 ? 0 : currentIndex + 1
			} else if (event.key === 'ArrowUp') {
				newIndex = currentIndex - 1 < 0 ? activeOptions.length - 1 : currentIndex - 1
			} else if (event.key === 'Home') {
				newIndex = 0
			} else if (event.key === 'End') {
				newIndex = activeOptions.length - 1
			}

			activeOptions.forEach((option, index) => {
				if (newIndex === index) {
					option.tabIndex = 0
					option.focus()
				} else {
					option.tabIndex = -1
				}
			})
		})
	}

	private attachOptionListeners(option: AppSelectOption) {
		if (this.attachedOptions.has(option)) {
			return
		}
		this.attachedOptions.add(option)
		option.addEventListener('click', () => {
			if (this.multiple) {
				option.selected = !option.selected
				option.tabIndex = option.selected ? 0 : -1
				this.value = this.getMultiValue()
			} else {
				option.selected = true
				option.tabIndex = 0
				this.value = option.value
				this.getSlottedOptions()
					.filter((opt) => opt.value !== this.value)
					.forEach((opt) => {
						opt.selected = false
						opt.tabIndex = -1
					})
				this.closeSelect()
				this.focus()
			}
			this.displayValue = this.getDisplayValue()
			this.onChange()
		})
	}

	protected firstUpdated() {
		this.getSlottedOptions()
			.filter((option) => !option.disabled)
			.forEach((option) => this.attachOptionListeners(option))
		this.onOptionsAdded() // Initial setup for pre-rendered options
	}

	protected updated() {
		this.formController.setValidity(this.input.validity, this.input.validationMessage, this.input)
	}

	closeSelect() {
		window.removeEventListener('keyup', this.handleKeyup)
		window.removeEventListener('mousedown', this.handleMouseDown)
		this.open = false
		this.popup.removeAttribute('style')
		this.onBlur()
		this.dispatchEvent(new Event('app-hide', { cancelable: true }))
	}

	async openSelect() {
		this.open = true
		await this.updateComplete
		this.calculatePosition()
		this.focusSelectedOption()
		this.dispatchEvent(new Event('app-show', { cancelable: true }))
		window.addEventListener('keyup', this.handleKeyup)
		window.addEventListener('mousedown', this.handleMouseDown)
	}

	toggleSelect() {
		if (this.open) {
			this.closeSelect()
		} else {
			this.openSelect()
		}
	}

	private handleMouseDown = (event: MouseEvent) => {
		const path = event.composedPath()
		if (!path.includes(this)) {
			this.closeSelect()
		}
	}

	private handleKeyup = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.closeSelect()
			this.focus()
		}
		if (event.key === 'Tab') {
			this.closeSelect()
		}
	}

	private focusSelectedOption() {
		const options = this.getSlottedOptions()
			.filter((option) => !option.disabled)
			.map((option) => {
				option.tabIndex = option.selected ? 0 : -1
				return option
			})
		const firstSelected = options.find((option) => option.selected)
		firstSelected?.focus()
	}

	private getSlottedOptions(): AppSelectOption[] {
		return this.assignedOptions
	}

	private onOptionsAdded() {
		this.getSlottedOptions().forEach((option) => {
			this.attachOptionListeners(option)
			const shouldBeSelected = this.value
				.split(',')
				.map((v) => v.trim())
				.filter((v) => !!v)
				.includes(option.value)
			if (shouldBeSelected) {
				option.selected = true
			}
		})
		this.displayValue = this.getDisplayValue()
	}

	private getMultiValue() {
		return this.getSlottedOptions()
			.filter((option) => option.selected)
			.map((option) => option.value)
			.join(',')
	}

	private getDisplayValue() {
		return this.getSlottedOptions()
			.filter((option) =>
				this.value
					.split(',')
					.map((v) => v.trim())
					.includes(option.value)
			)
			.map((option) => option.textContent)
			.filter((v) => !!v)
			.join(', ')
	}

	private handleSlotChange() {
		this.getSlottedOptions()
			.filter((option) => !this.attachedOptions.has(option))
			.forEach((option) => this.attachOptionListeners(option))
		this.onOptionsAdded() // Re-evaluate selected options after new ones are added
	}

	onChange() {
		this.touched = true
		this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }))
		this.dispatchEvent(new Event('change', { bubbles: true }))
	}

	onBlur() {
		this.touched = true
		this.dispatchEvent(new Event('app-blur', { bubbles: true, composed: true }))
	}

	onClick() {
		this.toggleSelect()
	}

	async onKeydown(event: KeyboardEvent) {
		if (!['Enter', 'Space'].includes(event.key)) {
			return
		}
		event.preventDefault()
		if (!this.open) {
			this.openSelect()
		}
	}

	private calculatePosition() {
		const anchorRect = this.trigger.getBoundingClientRect()

		const viewportHeight = window.innerHeight
		const popoverHeight = this.popup.offsetHeight

		const spaceBelow = viewportHeight - anchorRect.bottom
		const spaceAbove = anchorRect.top

		// default position
		this.popup.style.top = `auto`
		this.popup.style.bottom = `auto`
		this.popup.style.left = `auto`
		this.popup.style.right = `auto`

		if (spaceAbove > spaceBelow && spaceBelow < popoverHeight) {
			this.popup.style.bottom = `${anchorRect.height}px`
			this.popup.style.top = `auto`
		}

		if (spaceAbove > spaceBelow && spaceAbove < popoverHeight) {
			this.popup.style.height = `${spaceAbove - 15}px`
		}

		if (spaceBelow > spaceAbove && spaceBelow < popoverHeight) {
			this.popup.style.height = `${spaceBelow - 15}px`
		}
	}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.touched = false
		this.errorMessage = ''
	}

	formResetCallback() {
		this.value = this.defaultValue
		this.displayValue = this.getSlottedOptions().find((option) => option.value === this.value)?.textContent || ''
		this.touched = false
		this.errorMessage = ''
	}

	focus(options?: FocusOptions) {
		this.trigger.focus(options)
	}

	validated(validity: ValidityState, message: string) {
		this.errorMessage = this.touched && !validity.valid ? message : ''
	}

	get form() {
		return this.formController.form
	}

	get validity() {
		return this.formController.validity
	}

	get validationMessage() {
		return this.formController.validationMessage
	}

	get willValidate() {
		return this.formController.willValidate
	}

	checkValidity() {
		return this.formController.checkValidity()
	}

	reportValidity() {
		return this.formController.reportValidity()
	}

	render() {
		return html`
			<div class="form-control" part="form-control">
				${when(this.label, () => html`<label for="input" part="label">${this.label}</label>`)}
				<div class="container">
					<div class="select-wrapper" part="select-wrapper">
						<span class="prefix" part="prefix">
							<slot name="prefix"></slot>
						</span>
						<input
							id="trigger"
							part="input"
							?disabled=${this.disabled}
							?autofocus=${this.autofocus}
							?hidden=${this.hidden}
							readonly
							?required=${this.required}
							placeholder=${ifDefined(this.placeholder)}
							.value=${live(this.displayValue)}
							@click=${this.onClick}
							@keydown=${this.onKeydown}
						/>
						<input
							id="input"
							hidden
							.value=${live(this.value)}
							name=${ifDefined(this.name)}
							?required=${this.required}
							?disabled=${this.disabled}
							@change=${this.onChange}
						/>
						<span class="suffix" part="suffix">
							<slot name="suffix"></slot>
						</span>
						<span class="caret">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" part="svg">
								<path
									fill-rule="evenodd"
									d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
								></path>
							</svg>
						</span>
					</div>
					<div id="popover" part="popover" ?open=${this.open} @slotchange=${this.handleSlotChange}>
						<slot></slot>
					</div>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.errorMessage}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-select': AppSelect
	}
}

import { html, LitElement, css, type PropertyValues } from 'lit'
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { type FormControl, FormControlController } from '@app/controllers/form-control.controller'
import { when } from 'lit/directives/when.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { appSelectStyle } from '@app/elements/select/app-select.style'
import type { AppSelectOption } from '@app/elements/select-option/app-select-option.element'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-select')
export class CCSelect extends LitElement implements FormControl {
	static styles = [
		defaultStyle,
		appSelectStyle,
		css`
			.form-control {
				anchor-name: --anchor;
			}

			[popover] {
				inset: unset;
				position-anchor: --anchor;
				left: anchor(left);
				top: anchor(bottom);
				border: 1px solid light-dark(var(--gray-4), var(--gray-8));
				background-color: var(--theme-default-layer);
				border-radius: var(--radius-2);
				overflow: auto;
				padding: 5px 0;
				margin: 0;

				&:popover-open {
					display: flex;
					flex-direction: column;
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

	@property({ type: Boolean, reflect: true })
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

	@query('[popover]')
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

			const activeOptions = this.assignedOptions.filter((option) => !option.disabled)

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
				this.value = this.getMultiValue()
			} else {
				option.selected = true
				this.value = option.value
				this.assignedOptions.filter((opt) => opt.value !== this.value).forEach((opt) => (opt.selected = false))
				this.closeSelect()
				this.focus()
			}
			this.displayValue = this.getDisplayValue()
			this.onChange()
		})
	}

	protected firstUpdated() {}

	protected willUpdate(_changedProperties: PropertyValues): void {
		if (!_changedProperties.has('displayValue') && _changedProperties.has('value')) {
			this.assignedOptions.forEach((option) => {
				const shouldBeSelected = this.value
					.split(',')
					.map((v) => v.trim())
					.filter((v) => !!v)
					.includes(option.value)
				option.selected = shouldBeSelected
			})
			this.displayValue = this.getDisplayValue()
		}
	}

	protected updated() {
		this.formController.setValidity(this.input.validity, this.input.validationMessage, this.input)
	}

	closeSelect() {
		window.removeEventListener('keyup', this.handleKeyup)
		window.removeEventListener('mousedown', this.handleMouseDown)
		this.open = false
		this.popup.hidePopover()
		this.popup.removeAttribute('style')
		this.onBlur()
		this.dispatchEvent(new Event('app-hide', { cancelable: true }))
	}

	async openSelect() {
		this.open = true
		await this.updateComplete
		this.popup.showPopover()
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
		const options = this.assignedOptions
			.filter((option) => !option.disabled)
			.map((option) => {
				option.tabIndex = option.selected ? 0 : -1
				return option
			})
		const firstSelected = options.find((option) => option.selected)
		firstSelected?.focus()
	}

	private onOptionsAdded() {
		this.assignedOptions.forEach((option) => {
			this.attachOptionListeners(option)
			const shouldBeSelected = this.value
				.split(',')
				.map((v) => v.trim())
				.filter((v) => !!v)
				.includes(option.value)
			option.selected = shouldBeSelected
		})
		this.displayValue = this.getDisplayValue()
	}

	private getMultiValue() {
		return this.assignedOptions
			.filter((option) => option.selected)
			.map((option) => option.value)
			.join(',')
	}

	private getDisplayValue() {
		return this.assignedOptions
			.filter((option) =>
				this.value
					.split(',')
					.map((v) => v.trim())
					.includes(option.value)
			)
			.map((option) => option.textContent?.trim())
			.filter((v) => !!v)
			.join(', ')
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
		// Get the bounding rectangle of the anchor element.
		const anchorRect = this.trigger.getBoundingClientRect()

		this.popup.style.width = `${this.trigger.offsetWidth}px`

		// // Get the viewport dimensions.
		// const viewportWidth = window.innerWidth
		// const viewportHeight = window.innerHeight

		// // Get the current height of the popup. It might be adjusted later.
		// let popoverHeight = this.popup.offsetHeight
		// // Get the width of the popup.
		// const popoverWidth = this.popup.offsetWidth

		// // Calculate the available space below the anchor.
		// const spaceBelow = viewportHeight - anchorRect.bottom
		// // Calculate the available space above the anchor.
		// const spaceAbove = anchorRect.top
		// // Calculate the available space to the right of the anchor.
		// const spaceRight = viewportWidth - anchorRect.right
		// // Calculate the available space to the left of the anchor.
		// const spaceLeft = anchorRect.left

		// // Get the current vertical scroll position of the window.
		// const scrollY = Math.round(window.scrollY)

		// // If there's more space above than below, and the space above is less than the current popover height,
		// // reduce the popover's height to fit within the available space above (with a 15px margin).
		// if (spaceAbove > spaceBelow && spaceAbove < popoverHeight) {
		// 	this.popup.style.height = `${spaceAbove - 15}px`
		// 	// Update the popover height after resizing.
		// 	popoverHeight = this.popup.offsetHeight
		// }

		// // If there's more space below than above, and the space below is less than the current popover height,
		// // reduce the popover's height to fit within the available space below (with a 15px margin).
		// if (spaceBelow > spaceAbove && spaceBelow < popoverHeight) {
		// 	this.popup.style.height = `${spaceBelow - 15}px`
		// 	// Update the popover height after resizing.
		// 	popoverHeight = this.popup.offsetHeight
		// }

		// // Default positioning: place the top of the popup below the bottom of the anchor,
		// // and the left side of the popup aligned with the left side of the anchor.
		// // Add the vertical scroll offset to the top position to account for scrolling.
		// this.popup.style.insetBlockStart = `${anchorRect.top + scrollY + anchorRect.height}px`
		// this.popup.style.insetInlineStart = `${anchorRect.left}px`

		// // If there's more space above than below, position the top of the popup above the top of the anchor.
		// // Calculate the top position by subtracting the popover's height from the anchor's bottom position,
		// // and adding the vertical scroll offset.
		// if (spaceAbove > spaceBelow && spaceBelow < popoverHeight) {
		// 	this.popup.style.insetBlockStart = `${anchorRect.bottom - anchorRect.height - popoverHeight + scrollY}px`
		// }

		// // If there's more space to the left than to the right, position the right side of the popup aligned with the right side of the anchor.
		// // Calculate the left position by subtracting the popover's width from the anchor's right position.
		// if (spaceLeft > spaceRight) {
		// 	this.popup.style.insetInlineStart = `${anchorRect.right - popoverWidth}px`
		// }
	}

	formDisabledCallback(disabled: boolean) {
		this.disabled = disabled
		this.touched = false
		this.errorMessage = ''
	}

	formResetCallback() {
		this.value = this.defaultValue
		this.displayValue = this.assignedOptions.find((option) => option.value === this.value)?.textContent || ''
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
				<div popover="manual" part="popover" ?open=${this.open}>
					<slot @slotchange=${this.onOptionsAdded}></slot>
				</div>
				<small class="invalid" part="invalid" ?hidden=${this.disabled || !this.errorMessage}>${this.errorMessage}</small>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-select': CCSelect
	}
}

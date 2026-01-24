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
export class AppSelect extends LitElement implements FormControl {
	static styles = [
		defaultStyle,
		appSelectStyle,
		css`
			.select-wrapper {
				anchor-name: --anchor;
			}

			[popover] {
				position-anchor: --anchor;
				width: anchor-size(width);
				position-try: flip-block;
				position-area: span-bottom;
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
	accessor required = false

	@property({ type: Boolean, reflect: true })
	accessor disabled = false

	@property({ type: Boolean })
	accessor autofocus = false

	@property({ type: Boolean })
	accessor hidden = false

	@property({ type: String })
	accessor name = ''

	@property({ type: String })
	accessor label = ''

	@property({ type: String })
	accessor autocomplete: 'on' | 'off' = 'off'

	@property({ type: String })
	accessor value: string = ''

	@property({ type: String })
	accessor defaultValue = ''

	@property({ type: String })
	accessor displayValue = ''

	@property({ type: String })
	accessor placeholder: string | undefined

	@property({ type: Boolean, reflect: true })
	accessor open = false

	@property({ type: Boolean })
	accessor multiple = false

	@state()
	private accessor errorMessage: string = ''

	@state()
	accessor touched = false

	@query('#input')
	accessor input!: HTMLInputElement

	@query('#trigger')
	accessor trigger!: HTMLInputElement

	@query('[popover]')
	accessor popup!: HTMLElement

	@queryAssignedElements({ selector: 'app-select-option' })
	accessor assignedOptions!: AppSelectOption[]

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
		if (_changedProperties.has('value')) {
			this.assignedOptions.forEach((option) => {
				const shouldBeSelected = this.value
					.split(',')
					.map((v) => v.trim())
					.filter((v) => !!v)
					.includes(option.value)
				option.selected = shouldBeSelected
			})
		}
		if (!_changedProperties.has('displayValue') && _changedProperties.has('value')) {
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
					.includes(option.value),
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
		'app-select': AppSelect
	}
}

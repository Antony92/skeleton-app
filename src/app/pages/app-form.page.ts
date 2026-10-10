import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '@app/elements/input/app-input.element';
import '@app/elements/autocomplete/app-autocomplete.element';
import '@app/elements/checkbox/app-checkbox.element';
import '@app/elements/radio/app-radio.element';
import '@app/elements/radio-group/app-radio-group.element';
import '@app/elements/textarea/app-textarea.element';
import '@app/elements/button/app-button.element';
import '@app/elements/select/app-select.element';
import '@app/elements/select-option/app-select-option.element';
import '@app/elements/file-upload/app-file-upload.element';
import type { AppAutocomplete } from '@app/elements/autocomplete/app-autocomplete.element';
import { getProducts } from '@app/services/api.service';
import { pageHasUnsavedChanges } from '@app/shared/navigation';
import { notify } from '@app/shared/notification';
import { formStyle } from '@app/styles/form.style';
import { serializeForm, setPageTitle } from '@app/utils/html';

@customElement('app-form-page')
export class AppFormPage extends LitElement {
	static styles = [
		formStyle,
		css`
			.actions {
				display: flex;
				justify-content: flex-start;
				gap: 10px;
			}

			h3 {
				margin: 0 0 10px 0;
			}
		`,
	];

	@query('form')
	accessor form!: HTMLFormElement;

	@state()
	accessor formData = {
		name: '',
		email: '',
		textarea: '',
		checkbox: false,
		radio: '',
		select: '',
	};

	connectedCallback() {
		super.connectedCallback();
		setPageTitle('Form');
	}

	protected async firstUpdated() {}

	async submit(event: SubmitEvent) {
		event.preventDefault();
		if (!this.form.checkValidity()) {
			this.form.querySelector<HTMLElement>('*:state(invalid)')?.focus();
			return;
		}
		const data = serializeForm(this.form);
		pageHasUnsavedChanges(false);
		notify({ message: 'Form submitted', variant: 'success' });
		console.log(data);
	}

	async preload(clear = false) {
		if (clear) {
			this.formData = {
				name: '',
				email: '',
				textarea: '',
				checkbox: false,
				radio: '',
				select: '',
			};
		} else {
			this.formData = {
				name: 'Test',
				email: 'test@example.com',
				textarea: 'test text',
				checkbox: true,
				radio: '2',
				select: 'option-3',
			};
		}
	}

	render() {
		return html`
			<h3>Form</h3>
			<form @submit=${this.submit} @change=${() => pageHasUnsavedChanges()} novalidate>
				<app-input required name="name" label="Name" .value=${this.formData.name}></app-input>
				<app-input required name="email" label="Email" type="email" .value=${this.formData.email}></app-input>
				<app-textarea required name="textarea" label="Textarea" .value=${this.formData.textarea}></app-textarea>
				<app-checkbox required name="checkbox" label="Are you sure?" .checked=${this.formData.checkbox}></app-checkbox>
				<app-radio-group name="radio" required label="Select one radio" .value=${this.formData.radio}>
					<app-radio label="Radio 1" value="1"></app-radio>
					<app-radio label="Radio 2" value="2"></app-radio>
				</app-radio-group>

				<app-select required name="select" label="Select" placeholder="Select an option" clearable .value=${this.formData.select}>
					<app-select-option value="option-1">Option 1</app-select-option>
					<app-select-option value="option-2">Option 2</app-select-option>
					<app-select-option value="option-3">Option 3</app-select-option>
					<app-select-option value="option-4">Option 4</app-select-option>
					<app-select-option value="option-5">Option 5</app-select-option>
				</app-select>

				<app-autocomplete
				  name="phone"
					label="Search"
					placeholder="Search..."
					@app-search=${async (e: Event) => {
						const target = e.target as AppAutocomplete;
						const products = await getProducts(target.search);
						target.results = products.map((p: any) => ({ label: p.title, value: p.id }));
					}}>
					<app-icon slot="prefix" filled>search</app-icon>
				</app-autocomplete>

				<app-file-upload name="file" size="0.1">
					<app-button variant="primary" slot="trigger">Upload</app-button>
					Upload files here
				</app-file-upload>

				<div class="actions">
					<app-button variant="primary" type="submit">Submit</app-button>
					<app-button type="reset" @click=${() => this.preload(true)}>Reset</app-button>
					<app-button @click=${() => this.preload()}>Preload</app-button>
				</div>
			</form>
		`;
	}
}

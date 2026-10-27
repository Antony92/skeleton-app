import type { AppCheckbox } from '@app/elements/checkbox/app-checkbox.element';
import { appCheckboxGroupStyle } from '@app/elements/checkbox-group/app-checkbox-group.style';
import { FormElement } from '@app/mixins/form.mixin';
import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

@customElement('app-checkbox-group')
export class AppCheckboxGroup extends FormElement(LitElement) {
  static styles = [defaultStyle, appCheckboxGroupStyle, css``];

  @property({ type: Boolean })
  accessor required = false;

  @property({ type: String })
  accessor label = '';

  @property({ type: Number })
  accessor min: number | undefined = undefined;

  @property({ type: Number })
  accessor max: number | undefined = undefined;

  @query('fieldset')
  accessor fieldset!: HTMLFieldSetElement;

  @queryAssignedElements()
  accessor checkboxes!: AppCheckbox[];

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('app-change', () => {
      this.value = this.checkboxes
        .filter((c) => c.checked)
        .map((c) => c.value)
        .join(',');
      this.touched = true;
    });
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this.checkboxes.forEach((c) => {
      c.checked = this.value.split(',').includes(c.value);
      c.disabled = this.disabled;
    });
  }

  getValidity() {
    if (!this.value && this.required) {
      return {
        flags: { valueMissing: true },
        message: 'This field is required',
        anchor: this.fieldset,
      };
    }
    const length = this.value.split(',').length;
    if (this.min && length < this.min) {
      return {
        flags: { tooShort: true },
        message: `This field requires at least ${this.min} selected`,
        anchor: this.fieldset,
      };
    }
    if (this.max && length > this.max) {
      return {
        flags: { tooLong: true },
        message: `This field requires at most ${this.max} selected`,
        anchor: this.fieldset,
      };
    }
    return {};
  }

  focus(options?: FocusOptions) {
    this.checkboxes
      .filter((c) => !c.checked)
      .at(0)
      ?.focus(options);
  }

  render() {
    return html`
      <div class="form-control" part="form-control">
        <fieldset ?disabled=${this.disabled} name=${ifDefined(this.name)}>
          ${when(this.label, () => html`<legend>${this.label}</legend>`)}
          <slot></slot>
        </fieldset>
        <small class="invalid" part="invalid" ?hidden=${this.disabled || !this.message}
          >${this.message}</small
        >
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-checkbox-group': AppCheckboxGroup;
  }
}

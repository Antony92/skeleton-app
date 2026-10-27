import { LitElement, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

export type Constructor<T = object> = new (...args: any[]) => T;

export type Validity = {
  flags?: ValidityStateFlags;
  message?: string;
  anchor?: HTMLElement;
};

export interface FormControl {
  name: string;
  value: string;
  defaultValue: string;
  disabled: boolean;
  touched: boolean;
  message: string;
  internals: ElementInternals;

  readonly form: HTMLFormElement | null;
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  readonly validationTriggers: string[];

  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;

  formAssociatedCallback(form: HTMLFormElement | null): void;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;

  validated(validity: ValidityState, message: string): void;
  getValidity(): Validity;
  getFormValue(): File | string | FormData | null;
}

export const FormElement = <T extends Constructor<LitElement>>(superClass: T) => {
  class FormElementClass extends superClass {
    static readonly formAssociated = true;

    @property({ type: String, reflect: true })
    accessor name = '';

    @property({ type: String })
    accessor value = '';

    @property({ type: String })
    accessor defaultValue = '';

    @property({ type: Boolean, reflect: true })
    accessor disabled = false;

    @state()
    accessor touched = false;

    @state()
    accessor message = '';

    #customError = '';
    internals = this.attachInternals();

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('invalid', async () => {
        this.touched = true;
      });
    }

    getValidity(): Validity {
      return {
        flags: {},
        message: '',
        anchor: undefined,
      };
    }

    get validationTriggers() {
      return [
        'value',
        'name',
        'disabled',
        'touched',
        'required',
        'min',
        'max',
        'maxlength',
        'minlength',
        'type',
        'pattern',
        'checked',
      ];
    }

    protected updated(_changedProperties: PropertyValues) {
      super.updated(_changedProperties);
      const shouldValidate = this.validationTriggers.some((prop) => _changedProperties.has(prop));
      if (shouldValidate) {
        void this.validate();
      }
    }

    async validate() {
      await this.updateComplete;

      const { flags = {}, message = '', anchor } = this.getValidity() ?? {};

      if (this.#customError) {
        this.internals.setValidity({ customError: true }, this.#customError, anchor);
      } else {
        this.internals.setValidity(flags, message, anchor);
      }

      const value = this.getFormValue();
      this.internals.setFormValue(value);

      this.internals.states.clear();
      const valid = this.internals.validity.valid;
      this.internals.states.add(valid ? 'valid' : 'invalid');

      if (this.touched) {
        this.internals.states.add(valid ? 'user-valid' : 'user-invalid');
      }

      this.validated(this.validity, this.validationMessage);
    }

    formAssociatedCallback(_form: HTMLFormElement | null) {}

    formDisabledCallback(disabled: boolean) {
      this.disabled = disabled;
      this.touched = false;
    }

    formResetCallback() {
      this.value = this.defaultValue;
      this.touched = false;
      this.#customError = '';
    }

    getFormValue(): File | string | FormData | null {
      return this.value || null;
    }

    validated(validity: ValidityState, message: string) {
      this.message = this.touched && !validity.valid ? message : '';
    }

    get form() {
      return this.internals.form;
    }

    get validity() {
      return this.internals.validity;
    }

    get validationMessage() {
      return this.internals.validationMessage;
    }

    get willValidate() {
      return this.internals.willValidate;
    }

    checkValidity() {
      return this.internals.checkValidity();
    }

    reportValidity() {
      return this.internals.reportValidity();
    }

    setCustomValidity(message: string) {
      this.#customError = message;
      void this.validate();
    }
  }

  return FormElementClass as unknown as Constructor<FormControl> & T;
};

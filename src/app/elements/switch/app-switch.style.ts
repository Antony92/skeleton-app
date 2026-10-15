import { css } from 'lit';

export const appSwitchStyle = css`
  :host(:state(user-invalid)) {
    .form-control {
      .switch-wrapper {
        .switch {
          outline-color: var(--theme-invalid-color);
        }
      }

      label {
        color: var(--theme-invalid-color);
      }
    }
  }

  .form-control {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5px;

    small {
      color: var(--theme-invalid-color);
    }

    &:has(input[required]) {
      label::after {
        content: ' *';
        color: var(--theme-invalid-color);
      }
    }

    .switch-wrapper {
      display: flex;
      gap: 5px;
      align-items: center;

      > label {
        width: fit-content;
        cursor: pointer;
      }

      .switch {
        position: relative;
        border-radius: 36px;

        input {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 10;
          width: 100%;
          height: 100%;
          cursor: pointer;
          opacity: 0;

          &:checked + label:before {
            background: var(--theme-primary-background);
            border: 2px solid transparent;
          }

          &:checked + label:after {
            left: 20px;
            background: var(--theme-white-color);
          }
        }

        label {
          position: relative;
          display: flex;
          align-items: center;

          &:before {
            content: '';
            width: 36px;
            height: 18px;
            position: relative;
            display: inline-block;
            border-radius: 46px;
            border: 2px solid var(--theme-muted-color);
            background: var(--theme-muted-color);
            transition: 0.2s ease-in;
          }

          &:after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            left: 3px;
            top: 3px;
            z-index: 2;
            border: 2px solid var(--theme-white-color);
            background: var(--theme-white-color);
            transition: 0.2s ease-in;
          }
        }
      }

      &:has(input:disabled) {
        opacity: 0.5;

        > label {
          cursor: not-allowed;
        }

        .switch {
          input {
            cursor: not-allowed;
          }
        }
      }

      &:has(input:focus-visible) {
        .switch {
          outline: 2px solid var(--theme-color);
        }
      }
    }
  }
`;

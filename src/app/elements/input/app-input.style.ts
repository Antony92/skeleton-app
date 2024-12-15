import { css } from 'lit'

export const appInputStyle = css`
	.form-control {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 5px;

		label {
			width: fit-content;
		}

		&:has(input[required]) {
			label::after {
				content: ' *';
				color: var(--theme-invalid-color);
			}
		}

		&:has(input:user-invalid) {
			label {
				color: var(--theme-invalid-color);
			}
		}

		.input-wrapper {
			display: flex;
			align-items: center;
			border: 1px solid var(--theme-default-color);
			width: 100%;
			border-radius: 3px;
			height: 30px;

			&:has(input:user-invalid) {
				border-color: var(--theme-invalid-color);
			}

			input {
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				background: none;
				padding: 0 10px;

				&::placeholder {
					color: var(--theme-default-color);
				}
			}

			.prefix,
			.suffix {
				display: flex;
				align-items: center;
			}

			.prefix ::slotted(*) {
				padding-left: 10px;
			}

			.suffix ::slotted(*) {
				padding-right: 10px;
			}

			&:has(input:disabled) {
				opacity: 0.5;
				cursor: not-allowed;
			}

			&:has(input:focus-visible) {
				outline: 2px solid var(--theme-color);
				border-radius: 2px;
			}

			&:has(input:user-invalid) {
				outline-color: var(--theme-invalid-color);
			}

			&:hover:not(:has(input:disabled, input:focus-within, input:user-invalid)) {
				border-color: var(--theme-primary-color);
			}
		}
	}
`

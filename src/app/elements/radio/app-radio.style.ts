import { css } from 'lit'

export const appRadioStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			.radio-wrapper {
				input {
					outline-color: var(--theme-invalid-color);
					border-color: var(--theme-invalid-color);

					&:hover {
						border-color: var(--theme-invalid-color);
					}
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

		.radio-wrapper {
			display: flex;
			gap: 5px;

			label {
				width: fit-content;
			}

			input {
				&:focus-visible {
					outline: 2px solid var(--theme-color);
				}

				&:hover:not(:disabled, :focus-within) {
					border-color: var(--theme-primary-color);
				}
			}

			&:has(input:disabled) {
				opacity: 0.5;

				input,
				label {
					cursor: not-allowed;
				}
			}
		}
	}
`

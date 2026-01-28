import { css } from 'lit'

export const appTextareaStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			.textarea-wrapper {
				textarea {
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

		label {
			width: fit-content;
		}

		small {
			color: var(--theme-invalid-color);
		}

		&:has(textarea[required]) {
			label::after {
				content: ' *';
				color: var(--theme-invalid-color);
			}
		}

		.textarea-wrapper {
			display: flex;
			align-items: center;
			width: 100%;

			textarea {
				width: 100%;
				resize: vertical;
				border: 1px solid var(--theme-default-color);
				border-radius: var(--radius-2);
				background: none;
				font-family: var(--font-system-ui);
				font-size: var(--font-size-1);
				font-weight: var(--font-weight-4);

				&::placeholder {
					color: var(--theme-default-color);
				}

				&:focus-visible {
					outline: 2px solid var(--theme-color);
				}

				&:hover:not(:disabled, :focus-within) {
					border-color: var(--theme-primary-color);
				}
			}

			&:has(textarea:disabled) {
				opacity: 0.5;

				textarea {
					cursor: not-allowed;
				}
			}
		}
	}
`

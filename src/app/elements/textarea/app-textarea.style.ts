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
			font-size: 0.9rem;
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
			background: var(--theme-default-surface);

			textarea {
				width: 100%;
				resize: vertical;
				border: 1px solid var(--theme-default-color);
				border-radius: var(--radius-2);
				background: none;
				font-family: var(--theme-font-family);
				font-size: var(--theme-font-size-1);
				padding: 10px;

				&::placeholder {
					color: var(--theme-muted-color);
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

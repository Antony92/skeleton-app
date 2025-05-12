import { css } from 'lit'

export const appFileUploadStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			.file-upload-wrapper {
				outline-color: var(--theme-invalid-color);
				border-color: var(--theme-invalid-color);

				&:hover {
					border-color: var(--theme-invalid-color);
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

		&:has(input[required]) {
			label::after {
				content: ' *';
				color: var(--theme-invalid-color);
			}
		}

		.file-upload-wrapper {
			display: flex;
			align-items: center;
			border: 2px dotted var(--theme-default-color);
			padding: 10px;
			border-radius: var(--radius-2);

			&:has(input:disabled) {
				opacity: 0.5;
				cursor: not-allowed;
			}

			&:has(input:focus-visible) {
				outline: 2px solid var(--theme-color);
			}

			&:hover:not(:has(input:disabled, input:focus-within)) {
				border-color: var(--theme-primary-color);
			}
		}
	}
`

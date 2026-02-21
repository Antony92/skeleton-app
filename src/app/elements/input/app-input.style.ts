import { css } from 'lit'

export const appInputStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			.input-wrapper {
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
			font-size: 0.9rem;
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

		.input-wrapper {
			display: flex;
			align-items: center;
			border: 1px solid var(--theme-default-color);
			background: var(--theme-default-surface);
			width: 100%;
			border-radius: var(--radius-2);
			height: 36px;

			input {
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				background: none;
				padding: 0 10px;
				font-family: var(--theme-font-family);
				font-size: var(--theme-font-size-1);

				&::placeholder {
					color: var(--theme-muted-color);
				}
			}

			.prefix,
			.suffix {
				display: flex;
				align-items: center;
			}

			.prefix ::slotted(*) {
				padding-left: 10px;
				font-size: 20px;
			}

			.suffix ::slotted(*) {
				padding-right: 10px;
				font-size: 20px;
			}

			&:has(input:disabled) {
				opacity: 0.5;

				input {
					cursor: not-allowed;
				}
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

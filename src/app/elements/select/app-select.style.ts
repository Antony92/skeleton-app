import { css } from 'lit'

export const appSelectStyle = css`
	:host(:state(user-invalid)) {
		.form-control {

			&:has([popover][open]) {
				.select-wrapper {
					outline-color: var(--theme-invalid-color);
				}
			}

			.select-wrapper {
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

		&:has([popover][open]) {
			.select-wrapper {
				outline: 2px solid var(--theme-color);
			}
		}

		.select-wrapper {
			display: flex;
			align-items: center;
			border: 1px solid var(--theme-default-color);
			width: 100%;
			border-radius: 3px;
			height: 30px;

			input {
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				background: none;
				padding: 0 10px;
				cursor: pointer;

				&::placeholder {
					color: var(--theme-default-color);
				}
			}

			.caret,
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

			.caret {
                position: absolute;
                right: 0;
                pointer-events: none;
				display: flex;
				align-items: center;
				cursor: pointer;
				padding-right: 10px;
				transition: 250ms rotate ease;
				transform-box: fill-box;
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

		&:has([popover][open]) {
			.caret {
				rotate: -180deg;
			}
		}
	}
`

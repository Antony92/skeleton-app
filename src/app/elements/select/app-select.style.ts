import { css } from 'lit';

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

				&:hover:not(:has(input:disabled, input:focus-within, ~ [popover][open])) {
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

		small.invalid {
			color: var(--theme-invalid-color);
		}

		small.no-results {
			color: var(--theme-muted-color);
			padding: 10px 25px 5px 25px;
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
			border-radius: var(--radius-2);
			height: 36px;
			position: relative;
			background: var(--theme-default-surface);
			transition-property: border-color;
			transition-duration: var(--transition-fast);
			transition-timing-function: var(--transition-easing);
			transform-origin: center center;

			input {
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				background: none;
				padding: 0px 10px;
				cursor: pointer;
				font-family: var(--theme-font-family);
				font-size: var(--theme-font-size-1);

				&::placeholder {
					color: var(--theme-muted-color);
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
				font-size: 20px;
			}

			.suffix ::slotted(*) {
				padding-right: 10px;
				font-size: 20px;
			}

			.clear {
				cursor: pointer;
				background: none;
				border: none;
				font-size: 20px;
				padding: 1px 35px 0px 0px;
				color: color-mix(in srgb, currentColor 90%, transparent);

				&:hover {
					color: color-mix(in srgb, currentColor 80%, transparent);
				}
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

			&:hover:not(:has(input:disabled, input:focus-within, ~ [popover][open])) {
				border-color: var(--theme-primary-color);
			}
		}

		&:has([popover][open]) {
			.caret {
				rotate: -180deg;
			}
		}

		input[type="search"] {
		  background: none;
		  border: none;
		  border-bottom: 1px solid var(--theme-default-color);
		  outline: none;
		  padding: 0 25px;
		  height: 30px;
		  position: relative;
		  top: -5px;
		}
	}
`;

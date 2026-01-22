import { css } from 'lit'

export const appButtonStyle = css`
	button {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: none;
		border-radius: var(--radius-2);
		padding: 10px;
		font-weight: var(--font-weight-6);
		box-shadow: var(--shadow-2);
		white-space: nowrap;
		height: 36px;

		&:active {
			opacity: 0.8;
		}

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
		}

		&.icon {
			font-size: inherit;
		}

		&.icon,
		&.text,
		&.outlined {
			box-shadow: none;
			background-color: transparent;
		}

		&.outlined {
			padding: calc(10px - 1px);
		}

		&.default {
			background-color: var(--theme-default-background);
			color: var(--theme-white-color);

			&.icon,
			&.text,
			&.outlined {
				background-color: transparent;
				color: var(--theme-default-color);
			}

			&.outlined {
				border: 1px solid var(--theme-default-color);
			}

			&:hover:not(:disabled) {
				background-color: var(--theme-default-hover);
				color: var(--theme-white-color);

				&.icon,
				&.text {
					background-color: transparent;
					color: var(--theme-default-hover);
				}
			}
		}

		&.primary {
			background-color: var(--theme-primary-background);
			color: var(--theme-white-color);

			&.icon,
			&.text,
			&.outlined {
				background-color: transparent;
				color: var(--theme-primary-color);
			}

			&.outlined {
				border: 1px solid var(--theme-primary-color);
			}

			&:hover:not(:disabled) {
				background-color: var(--theme-primary-hover);
				color: var(--theme-white-color);

				&.icon,
				&.text {
					background-color: transparent;
					color: var(--theme-primary-hover);
				}
			}
		}

		&.success {
			background-color: var(--theme-success-background);
			color: var(--theme-white-color);

			&.icon,
			&.text,
			&.outlined {
				background-color: transparent;
				color: var(--theme-success-color);
			}

			&.outlined {
				border: 1px solid var(--theme-success-color);
			}

			&:hover:not(:disabled) {
				background-color: var(--theme-success-hover);
				color: var(--theme-white-color);

				&.icon,
				&.text {
					background-color: transparent;
					color: var(--theme-success-hover);
				}
			}
		}

		&.warning {
			background-color: var(--theme-warning-background);
			color: var(--theme-white-color);

			&.icon,
			&.text,
			&.outlined {
				background-color: transparent;
				color: var(--theme-warning-color);
			}

			&.outlined {
				border: 1px solid var(--theme-warning-color);
				padding: calc(var(--size-fluid-1) - 1px);
			}

			&:hover:not(:disabled) {
				background-color: var(--theme-warning-hover);
				color: var(--theme-white-color);

				&.icon,
				&.text {
					background-color: transparent;
					color: var(--theme-warning-hover);
				}
			}
		}

		&.error {
			background-color: var(--theme-error-background);
			color: var(--theme-white-color);

			&.icon,
			&.text,
			&.outlined {
				color: var(--theme-error-color);
			}

			&.outlined {
				border: 1px solid var(--theme-error-color);
			}

			&:hover:not(:disabled) {
				background-color: var(--theme-error-hover);
				color: var(--theme-white-color);

				&.icon,
				&.text {
					background-color: transparent;
					color: var(--theme-error-hover);
				}
			}
		}
	}
`

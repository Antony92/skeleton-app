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
		font-size: inherit;
		font-weight: var(--font-weight-6);
		box-shadow: var(--shadow-2);
		white-space: nowrap;

		&.icon,
		&.text {
			background: none;
			box-shadow: none;
			color: var(--theme-primary);

			&:hover:not(:disabled) {
				opacity: 0.8;
			}
		}

		&.primary {
			background-color: var(--theme-primary);
			color: var(--theme-white);

			&:hover:not(:disabled) {
				background-color: var(--theme-primary-hover);
			}
		}

		&.secondary {
			background-color: var(--theme-secondary);
			color: var(--theme-white);

			&:hover:not(:disabled) {
				background-color: var(--theme-secondary-hover);
			}
		}

		&.success {
			background-color: var(--theme-success);
			color: var(--theme-white);

			&:hover:not(:disabled) {
				background-color: var(--theme-success-hover);
			}
		}

		&.error {
			background-color: var(--theme-error);
			color: var(--theme-white);

			&:hover:not(:disabled) {
				background-color: var(--theme-error-hover);
			}
		}

		&.warning {
			background-color: var(--theme-warning);
			color: var(--theme-white);

			&:hover:not(:disabled) {
				background-color: var(--theme-warning-hover);
			}
		}

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
		}

		&:focus-visible {
			outline: 2px solid var(--theme-color);
			border-radius: 2px;
		}
	}
`

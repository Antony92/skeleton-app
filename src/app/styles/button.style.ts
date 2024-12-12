import { css } from 'lit'

export const buttonStyle = css`
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
		color: var(--theme-white);
		white-space: nowrap;

		&:focus-visible {
			outline: 2px solid var(--theme-color);
			border-radius: 2px;
			outline-offset: 2px;
		}

		i.icon {
			color: var(--theme-white);
		}

		&.primary {
			background-color: var(--theme-primary);

			&:hover:not(:disabled) {
				background-color: var(--theme-primary-hover);
			}
		}

		&.secondary {
			background-color: var(--theme-secondary);

			&:hover:not(:disabled) {
				background-color: var(--theme-secondary-hover);
			}
		}

		&.success {
			background-color: var(--theme-success);

			&:hover:not(:disabled) {
				background-color: var(--theme-success-hover);
			}
		}

		&.error {
			background-color: var(--theme-error);

			&:hover:not(:disabled) {
				background-color: var(--theme-error-hover);
			}
		}

		&.warning {
			background-color: var(--theme-warning);

			&:hover:not(:disabled) {
				background-color: var(--theme-warning-hover);
			}
		}

		&.only-icon {
			background: none;
			box-shadow: none;

			i.icon {
				color: var(--theme-primary);
			}

			&:hover:not(:disabled) {
				background: none;
				opacity: 0.8;
			}
		}

		&.only-text {
			background: none;
			box-shadow: none;
			color: var(--theme-primary);

			&:hover:not(:disabled) {
				background: none;
				opacity: 0.8;
			}
		}

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
		}
	}
`

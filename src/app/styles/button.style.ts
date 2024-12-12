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
		color: var(--gray-1);
		white-space: nowrap;

		&:focus-visible {
			outline: 2px solid light-dark(var(--light-theme-color), var(--dark-theme-color));
			border-radius: 2px;
			outline-offset: 2px;
		}

		i.icon {
			color: var(--gray-1);
		}

		&.primary {
			background: var(--blue-8);

			&:hover:not(:disabled) {
				background: var(--blue-9);
			}
		}

		&.default {
			background: var(--stone-8);

			&:hover:not(:disabled) {
				background: var(--stone-9);
			}
		}

		&.success {
			background: var(--green-8);

			&:hover:not(:disabled) {
				background: var(--green-9);
			}
		}

		&.error {
			background: var(--red-8);

			&:hover:not(:disabled) {
				background: var(--red-9);
			}
		}

		&.warning {
			background: var(--yellow-8);

			&:hover:not(:disabled) {
				background: var(--yellow-9);
			}
		}

		&.only-icon {
			background: none;
			box-shadow: none;

			i.icon {
				color: light-dark(var(--light-theme-primary), var(--dark-theme-primary));
			}

			&:hover:not(:disabled) {
				background: none;
				opacity: 0.8;
			}
		}

		&.only-text {
			background: none;
			box-shadow: none;
			color: light-dark(var(--light-theme-primary), var(--dark-theme-primary));

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

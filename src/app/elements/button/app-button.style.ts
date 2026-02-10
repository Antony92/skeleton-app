import { css } from 'lit'

export const appButtonStyle = css`
	button,
	a {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: none;
		border-radius: var(--radius-2);
		padding: 0 10px;
		box-shadow: var(--shadow-2);
		white-space: nowrap;
		height: 36px;
		background-color: var(--background);
		color: var(--color);
		font-family: var(--font-system-ui);
		font-size: 0.875rem;
		font-weight: var(--font-weight-6);
		text-decoration: none;

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
		}

		&:not(:disabled):active {
			background-color: color-mix(in oklab, var(--background), black 16%);
		}

		&:hover:not(:active, :disabled) {
			background-color: color-mix(in oklab, var(--background), black 8%);
		}
	}

	:host([variant='primary']) {
		--background: var(--theme-primary-background);
		--color: var(--theme-white-color);
	}

	:host([variant='success']) {
		--background: var(--theme-success-background);
		--color: var(--theme-white-color);
	}

	:host([variant='warning']) {
		--background: var(--theme-warning-background);
		--color: var(--theme-white-color);
	}

	:host([variant='error']) {
		--background: var(--theme-error-background);
		--color: var(--theme-white-color);
	}

	:host([appearance='plain']) {
		button,
		a {
			box-shadow: none;
			background-color: transparent;
			color: var(--background);

			&:not(:disabled):active {
				color: color-mix(in oklab, var(--background), black 16%);
			}

			&:hover:not(:active, :disabled) {
				color: color-mix(in oklab, var(--background), black 8%);
			}
		}
	}

	:host([appearance='outlined']) {
		button,
		a {
			box-shadow: none;
			background-color: transparent;
			border: 1px solid var(--background);
			color: var(--background);

			&:not(:disabled):active {
				background-color: color-mix(in oklab, var(--background), black 65%);
			}

			&:hover:not(:active, :disabled) {
				background-color: color-mix(in oklab, var(--background), black 60%);
			}
		}
	}

	:host(:not([appearance='plain'])) {
		::slotted(app-icon) {
			font-size: 20px;
		}
	}
`

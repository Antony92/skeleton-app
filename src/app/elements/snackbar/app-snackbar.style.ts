import { css } from 'lit'

export const appSnackbarStyle = css`
	.snackbar {
		align-items: center;
		gap: 10px;
		max-width: 85vw;
		box-shadow: var(--shadow-2);
		padding: 15px;
		border: none;
		border-radius: 0.25rem;

		&:popover-open {
			display: flex;
			inset: auto;
		}

		&.top {
			right: 0;
			left: 0;
			top: 15px;
		}

		&.top-right {
			right: 15px;
			left: auto;
			top: 15px;
		}

		&.top-left {
			right: auto;
			left: 15px;
			top: 15px;
		}


		&.bottom {
			right: 0;
			left: 0;
			bottom: 15px;
		}

		&.bottom-right {
			right: 15px;
			left: auto;
			bottom: 15px;
		}

		&.bottom-left {
			right: auto;
			left: 15px;
			bottom: 15px;
		}

		button {
			margin-left: auto;
			background: none;
			cursor: pointer;
			border: none;
			color: var(--theme-primary-color);
			font-weight: var(--font-weight-6);

			&:hover {
				color: var(--theme-primary-hover);
			}
		}

		&.default {
			background-color: var(--theme-inverse-layer);
			color: var(--theme-color-inverse);
		}

		&.primary {
			background-color: var(--theme-primary-layer);
			color: var(--theme-white-color);
		}

		&.success {
			background-color: var(--theme-success-layer);
			color: var(--theme-white-color);
		}

		&.error {
			background-color: var(--theme-error-layer);
			color: var(--theme-white-color);
		}

		&.warning {
			background-color: var(--theme-warning-layer);
			color: var(--theme-white-color);
		}

		slot[name="icon"] {
			font-size: 1.2rem;
		}
	}
`

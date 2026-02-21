import { css } from 'lit'

export const appSnackbarStyle = css`
	[popover] {
		align-items: center;
		gap: 10px;
		max-width: 85vw;
		box-shadow: var(--shadow-2);
		padding: 15px;
		border: none;
		border-radius: 0.25rem;
		background-color: var(--background);
		color: var(--color);

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
			font-family: var(--theme-font-family);
			font-size: var(--theme-font-size-1);
			font-weight: 600;
			margin-left: auto;
			background: none;
			cursor: pointer;
			border: none;
			color: var(--action);

			&:hover {
				color: color-mix(in oklab, var(--action), black 8%);
			}
		}
	}

	:host([variant='primary']) {
		--background: var(--theme-primary-layer);
		--color: var(--theme-white-color);
		--action: var(--theme-white-color);
	}

	:host([variant='success']) {
		--background: var(--theme-success-layer);
		--color: var(--theme-white-color);
		--action: var(--theme-white-color);
	}

	:host([variant='warning']) {
		--background: var(--theme-warning-layer);
		--color: var(--theme-white-color);
		--action: var(--theme-white-color);
	}

	:host([variant='error']) {
		--background: var(--theme-error-layer);
		--color: var(--theme-white-color);
		--action: var(--theme-white-color);
	}

	slot[name='icon'] {
		font-size: 1.2rem;
	}
`

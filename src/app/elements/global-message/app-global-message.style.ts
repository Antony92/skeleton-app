import { css } from 'lit'

export const appGlobalMessageStyle = css`
	.global-message {
		align-items: center;
		gap: 10px;
		min-width: 300px;
		box-shadow: var(--shadow-2);
		padding: 15px;
		border: none;
		border-radius: 0.25rem;
		font-weight: var(--font-weight-5);
		color: var(--theme-white-color);

		&:popover-open {
			display: flex;
			inset: auto;
			right: 0px;
			left: 0px;
			top: 15px;
		}

		&.info {
			background-color: var(--theme-primary-layer);
		}

		&.error {
			background-color: var(--theme-error-layer);
		}

		&.warning {
			background-color: var(--theme-warning-layer);
		}

		.icon {
			color: var(--theme-white-color);
			font-size: 1.2rem;
		}

		button {
			margin-left: auto;
			background: none;
			cursor: pointer;
			border: none;
			color: var(--theme-white-color);
		}
	}
`

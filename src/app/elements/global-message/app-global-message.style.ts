import { css } from 'lit'

export const appGlobalMessageStyle = css`
	.global-message {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 300px;
		box-shadow: var(--shadow-2);
		padding: 15px;
		border: none;
		border-radius: 0.25rem;
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-5);
		color: var(--theme-white);

		&:popover-open {
			inset: auto;
			right: 0px;
			left: 0px;
			top: 15px;
		}

		&.info {
			background-color: var(--theme-info-layer);
		}

		&.error {
			background-color: var(--theme-error-layer);
		}

		&.warning {
			background-color: var(--theme-warning-layer);
		}

		.icon {
			width: var(--size-4);
			height: var(--size-4);
			color: var(--theme-white);
		}

		button {
			margin-left: auto;
			background: none;
			cursor: pointer;
			border: none;
			color: var(--theme-white);
		}
	}
`

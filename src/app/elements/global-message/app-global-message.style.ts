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

		&:popover-open {
			inset: unset;
			right: 0px;
			left: 0px;
			top: 15px;
		}

		&.info {
			background-color: var(--theme-default-layer);
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
		}

		button {
			margin-left: auto;
			padding: 0;
			background: none;
			cursor: pointer;
			border: none;
		}
	}
`

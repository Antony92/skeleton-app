import { css } from 'lit'

export const appBadgeStyle = css`
	.badge {
		border-radius: var(--radius-2);
		padding: 4px 6px;
		font-weight: var(--font-weight-6);
		font-size: var(--font-size-0);
		cursor: default;

		&.default {
			background-color: var(--theme-default-background);
			color: var(--theme-white-color);
		}

		&.primary {
			background-color: var(--theme-primary-background);
			color: var(--theme-white-color);
		}

		&.success {
			background-color: var(--theme-success-background);
			color: var(--theme-white-color);
		}

		&.warning {
			background-color: var(--theme-warning-background);
			color: var(--theme-white-color);
		}

		&.error {
			background-color: var(--theme-error-background);
			color: var(--theme-white-color);
		}

		&.pulse {
			animation: pulse-animation 1.5s infinite;
		}
	}

	@keyframes pulse-animation {
		0% {
			box-shadow: 0 0 0 0px #0080FF90;
		}
		100% {
			box-shadow: 0 0 0 10px #0080FF00;
		}
	}
`

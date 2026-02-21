import { css } from 'lit'

export const appBadgeStyle = css`
	.badge {
		border-radius: var(--radius-1);
		padding: 6px 10px;
		font-size: .65rem;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
		cursor: default;
		color: var(--color);
		background: var(--background);

		&.default {
			--background: color-mix(in srgb, var(--theme-default-background) 30%, transparent);
			--color: var(--theme-muted-color);
		}

		&.primary {
			--background: color-mix(in srgb, var(--theme-primary-background) 20%, transparent);
			--color: var(--theme-primary-color);
		}

		&.success {
			--background: color-mix(in srgb, var(--theme-success-background) 20%, transparent);
			--color: var(--theme-success-color);
		}

		&.warning {
			--background: color-mix(in srgb, var(--theme-warning-background) 20%, transparent);
			--color: var(--theme-warning-color);
		}

		&.error {
			--background: color-mix(in srgb, var(--theme-error-background) 20%, transparent);
			--color: var(--theme-error-color);
		}

		&.pulse {
			animation: pulse-animation 1.5s infinite;
		}
	}

	@keyframes pulse-animation {
		0% {
			box-shadow: 0 0 0 0px color-mix(in srgb, var(--background) 90%, transparent);
		}
		100% {
			box-shadow: 0 0 0 10px color-mix(in srgb, var(--background) 0%, transparent);
		}
	}
`

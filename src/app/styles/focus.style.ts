import { css } from 'lit'

export const focusStyle = css`
	.focus-visible {
		&:focus-visible {
			outline: 2px solid light-dark(var(--light-theme-color), var(--dark-theme-color));
			border-radius: 2px;
			outline-offset: 2px;
		}
	}

	.focus-within {
		&:focus-within {
			outline: 2px solid light-dark(var(--light-theme-color), var(--dark-theme-color));
			border-radius: 2px;
			outline-offset: 2px;
		}
	}
`

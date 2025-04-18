import { css } from 'lit'

export const focusStyle = css`
	.focus-visible {
		&:focus-visible {
			outline: 2px solid var(--theme-color);
        	border-radius: 2px;
		}
	}

	.focus-within {
		&:focus-within {
			outline: 2px solid var(--theme-color);
        	border-radius: 2px;
		}
	}
`

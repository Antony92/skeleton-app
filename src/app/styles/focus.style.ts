import { css } from 'lit'

export const focusStyle = css`
	.focus-visible {
		&:focus-visible {
			outline: 3px solid var(--theme-default-color);
        	border-radius: 2px;
		}
	}

	.focus-within {
		&:focus-within {
			outline: 3px solid var(--theme-default-color);
        	border-radius: 2px;
		}
	}
`

import { css } from 'lit';

export const defaultStyle = css`
	* {
		box-sizing: border-box;
	}

	a[target="_blank"]::after {
	  content: '↗';
	}
`;

import { css } from 'lit';

export const defaultStyle = css`
	* {
		box-sizing: border-box;
	}

	a.link[target="_blank"]::after {
	  content: '↗';
	}
`;

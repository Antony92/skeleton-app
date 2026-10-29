import { css } from 'lit';

export const pageStyle = css`
  :host {
    display: block;

    @media (min-width: 768px) {
      max-width: fit-content;
      margin: 0px auto;
    }
  }
`;

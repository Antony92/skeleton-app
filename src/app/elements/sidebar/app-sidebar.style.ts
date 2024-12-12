import { css } from 'lit'

export const appSidebarStyle = css`
	aside {
		width: 90px;
		height: 100%;
		background-color: var(--theme-sidebar);
		transition: background-color 300ms ease-in-out;

		ul {
			display: flex;
			flex-direction: column;
			gap: 20px;
			list-style: none;
			padding: 0;
			margin: 0;
			height: 100%;

			&:before,
			&:after {
				content: '';
			}

			li {
				width: 100%;

				&.bottom {
					margin-top: auto;
				}

				a {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 5px;
					text-decoration: none;
					cursor: pointer;
					color: var(--theme-color);

					span:first-child {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 56px;
						height: 32px;
						border-radius: 16px;
						transition: all 0.3s;

						.icon {
							transition: scale 0.3s;
                            width: 1.2rem;
                            height: 1.2rem;
						}
					}

					span:last-child {
						font-size: 12px;
					}

					&.active {
						span:first-child {
							box-shadow: var(--shadow-1);
							background-color: var(--theme-primary);
							color: var(--theme-primary);

							.icon {
                                color: var(--theme-white);
								scale: 1.1;
							}
						}

						span:last-child {
							color: var(--theme-primary);
						}
					}

					&:hover:not(.active) {
						span:first-child {
							background-color: light-dark(var(--gray-5), var(--gray-7));

							.icon {
								scale: 1.1;
							}
						}
					}
				}
			}
		}
	}

	@media only screen and (max-width: 900px) {
		aside {
			width: 100%;

			ul {
				margin: 0;
				flex-direction: row;
				overflow: auto;
				width: 100vw;

				li {
					&.hide-on-mobile {
						display: none;
					}

					a {
						margin: 10px 0px;
					}
				}
			}
		}
	}
`

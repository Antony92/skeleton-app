import { css } from 'lit'

export const appHeaderStyle = css`
    header {
        display: flex;
        gap: 10px;
        align-items: center;
        height: 60px;
        padding: 0 5px;
        box-shadow: var(--sl-shadow-x-large);
        background-color: light-dark(var(--light-theme-header), var(--dark-theme-header));
        transition: background-color 300ms ease-in-out;
    }

    .spacer {
        flex-grow: 1;
    }

    .title {
        margin-left: 5px;
    }

    .logo {
        margin-left: 10px;
        width: 40px;
    }

    .hamburger {
        font-size: 30px;
        display: none;
    }

    sl-avatar {
        cursor: pointer;
    }

    @media (max-width: 800px) {
        .hamburger {
            display: block;
        }

        .title {
           display: none;
        }

        .logo {
            display: none;
        }
    }
`

export const appDrawerStyle = css`
    sl-drawer {
        --size: 320px;
    }

    sl-drawer ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    sl-drawer ul li a {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 0px;
        cursor: pointer;
        border-radius: 25px;
        color: var(--sl-color-neutral-700);
        text-decoration: none;
    }

    sl-drawer ul li a:not(.active):hover {
        background: var(--sl-color-neutral-300);
    }

    sl-drawer ul li a sl-icon {
        margin-left: 15px;
    }

    ul li a.active {
        box-shadow: var(--sl-shadow-x-large);
        background: var(--sl-color-sky-600);
        color: var(--sl-color-neutral-0);
    }
`
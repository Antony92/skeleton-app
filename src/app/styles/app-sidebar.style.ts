import { css } from 'lit'

export const appSidebarStyle = css`
    nav {
        width: 90px;
        height: 100%;
        background-color: var(--sl-color-neutral-50);
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 20px;
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
    }

    ul:before,
    ul:after {
        content: '';
    }

    ul li {
        width: 100%;
    }

    ul li a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        color: var(--sl-color-neutral-700);
        text-decoration: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }

    ul li a span:first-child {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 32px;
        border-radius: 16px;
        transition: all 0.3s;
    }

    ul li a span:first-child sl-icon {
        font-size: 20px;
        transition: scale 0.3s;
    }

    ul li a.active span:first-child {
        box-shadow: var(--sl-shadow-x-large);
        background: var(--sl-color-sky-600);
        color: var(--sl-color-neutral-0);
    }

    ul li a:hover:not(.active) span:first-child {
        background: var(--sl-color-neutral-300);
    }

    ul li a:hover span:first-child sl-icon,
    ul li a.active span sl-icon {
        scale: 1.1;
    }

    ul li a span:nth-child(2) {
        font-size: 12px;
    }

    ul li a.active span:nth-child(2) {
        color: var(--sl-color-sky-600);
    }

    ul li.bottom {
        margin-top: auto;
    }

    @media only screen and (max-width: 800px) {
        
        nav {
            width: 100%;
            border-right: none;
        }

        ul {
            margin: 0;
            flex-direction: row;
            overflow: auto;
            width: 100vw;
        }

        ul li a {
            margin: 10px 0px;
        }

        ul li.hide-on-mobile {
            display: none;
        }
    }
`
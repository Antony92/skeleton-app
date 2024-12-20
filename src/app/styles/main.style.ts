import { css } from 'lit'

export const mainStyle = css`
    .layout {
        height: 100vh;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
        grid-template-areas:
            "header header"
            "sidebar main";
    }

    .main {
        grid-area: main;
        padding: 20px 20px 80px 20px;
        overflow: auto;
    }

    .sidebar {
        grid-area: sidebar;
    }

    .header {
        grid-area: header;
        z-index: var(--layer-1);
    }

    @media only screen and (max-width: 900px) {

        .layout {
            grid-template-columns: auto;
            grid-template-areas:
                "header"
                "main"
                "sidebar";
        }
    }
`
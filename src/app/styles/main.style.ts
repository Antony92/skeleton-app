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
        z-index: 4;
    }

    .header {
        grid-area: header;
        z-index: 5;
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

export const appPageTitleStyle = css`
    h3.title {
        margin: 0;
        padding-bottom: 15px;
    }
`
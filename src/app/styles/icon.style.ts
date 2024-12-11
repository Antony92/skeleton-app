import { icon, config } from '@fortawesome/fontawesome-svg-core'
import { css, html } from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

// Solid icons imports
import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons'

// Regular icons imports
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons'

// Brands icons imports
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

// Disable global icon styles
config.autoAddCss = false

// Global styles
export const iconStyle = css`
    .icon {
        display: block;
        width: 1rem;
        height: 1rem;
        color: light-dark(var(--light-theme-color), var(--dark-theme-color));
    }
`
// Solid icons
export const userSolidIcon = html`${unsafeSVG(icon(faUserSolid).html[0])}`

// Regular icons
export const userRegularIcon = html`${unsafeSVG(icon(faUserRegular).html[0])}`

// Brans icons
export const twitterIcon = html`${unsafeSVG(icon(faTwitter).html[0])}`
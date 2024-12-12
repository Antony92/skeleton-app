import { icon, config } from '@fortawesome/fontawesome-svg-core'
import { css, html } from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

// Solid icons imports
import {
	faInfoCircle,
	faTriangleExclamation,
	faCircleExclamation,
	faMagnifyingGlass,
	faHome,
	faScrewdriverWrench,
	faSkull,
} from '@fortawesome/free-solid-svg-icons'

// Regular icons imports
// import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons'

// Brands icons imports
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

// Disable global icon styles
config.autoAddCss = false

// Global styles
export const iconStyle = css`
	i.icon {
		display: block;
		width: 1rem;
		height: 1rem;
	}
`
// Solid icons
export const faInfoCircleIcon = html`${unsafeSVG(icon(faInfoCircle).html[0])}`
export const faTriangleExclamationIcon = html`${unsafeSVG(icon(faTriangleExclamation).html[0])}`
export const faCircleExclamationIcon = html`${unsafeSVG(icon(faCircleExclamation).html[0])}`
export const faMagnifyingGlassIcon = html`${unsafeSVG(icon(faMagnifyingGlass).html[0])}`
export const faHomeIcon = html`${unsafeSVG(icon(faHome).html[0])}`
export const faScrewdriverWrenchIcon = html`${unsafeSVG(icon(faScrewdriverWrench).html[0])}`
export const faSkullIcon = html`${unsafeSVG(icon(faSkull).html[0])}`

// Regular icons
// export const userRegularIcon = html`${unsafeSVG(icon(faUserRegular).html[0])}`

// Brans icons
export const twitterIcon = html`${unsafeSVG(icon(faTwitter).html[0])}`

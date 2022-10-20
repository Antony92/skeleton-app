// Import Shoelace themes
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'

// Import main styles
import './main.css'

// Theme
import { applyTheme } from './app/utils/theme'

// Preload some elements
import './app/elements/app-global-message.element'
import './app/elements/app-loading-status.element'

// Import root element
import './app/app-root.element'

// set up theme
applyTheme()

// Import Shoelace themes
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'

// Import main styles
import './main.css'

// HTTP Interceptor
import './http.interceptor'

// Theme utils
import { applyTheme } from './app/utils/theme'

// Import root element
import './app/app-root.element'

// set up theme
applyTheme()

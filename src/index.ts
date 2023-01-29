// Import root element
import './app/app-root.element'

// Theme
import { applyTheme } from './app/utils/theme'

// set up theme
applyTheme()

// when root is loaded add ready to body
await Promise.allSettled([
    customElements.whenDefined('app-root'),
])

document.querySelector('body')?.classList.add('ready')

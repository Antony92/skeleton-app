import { registerSW } from 'virtual:pwa-register'
import { refreshTokenSilently } from '@app/shared/auth'
import { applyDefaultTheme } from '@app/utils/theme'

// Icons
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// Register service worker
registerSW({ immediate: true })

// Set up theme
applyDefaultTheme()

// Set up icons
config.autoAddCss = false
library.add(fas, far, fab)

// Load app
Promise.allSettled([
    // await refreshTokenSilently(),
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('initializing')
    document.querySelector('.initializing-loader')?.remove()
})


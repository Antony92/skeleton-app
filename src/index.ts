// service worker
import { registerSW } from 'virtual:pwa-register'

// register service worker
registerSW({ immediate: true })

// import root element
import './app/app-root.element'

// theme
import { applyTheme } from './app/utils/theme'

// set up theme
applyTheme()

// when root is loaded add ready to body
Promise.allSettled([customElements.whenDefined('app-root')]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})

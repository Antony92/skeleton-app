// service worker
import { registerSW } from 'virtual:pwa-register'

// register service worker
registerSW({ immediate: true })

// theme
import { applyTheme } from './app/utils/theme'

// set up theme
applyTheme()

// when root is hide loading 
Promise.allSettled([
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})


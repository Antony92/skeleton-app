// service worker
import { registerSW } from 'virtual:pwa-register'

// register service worker
registerSW({ immediate: true })

// theme
import { applyTheme } from './app/utils/theme'
import { refreshTokenSilently } from './app/services/auth.service'

// set up theme
applyTheme()

// when root is hide loading 
Promise.allSettled([
    await refreshTokenSilently(),
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})


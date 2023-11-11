import { registerSW } from 'virtual:pwa-register'
import { applyTheme } from './app/utils/theme'
import { refreshTokenSilently } from './app/services/auth.service'

// register service worker
registerSW({ immediate: true })

// set up theme
applyTheme()

Promise.allSettled([
    await refreshTokenSilently(),
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})


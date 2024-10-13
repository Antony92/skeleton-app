import { registerSW } from 'virtual:pwa-register'
import { applyDefaultTheme } from './app/utils/theme'
import { refreshTokenSilently } from './app/shared/auth'

// register service worker
registerSW({ immediate: true })

// set up theme
applyDefaultTheme()

Promise.allSettled([
    await refreshTokenSilently(),
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})


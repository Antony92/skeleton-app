import { registerSW } from 'virtual:pwa-register'
import { refreshTokenSilently } from '@app/shared/auth'
import { applyDefaultTheme } from '@app/utils/theme'

// Register service worker
registerSW({ immediate: true })

// Set up theme
applyDefaultTheme()

// Load app
Promise.allSettled([
    await refreshTokenSilently(),
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})


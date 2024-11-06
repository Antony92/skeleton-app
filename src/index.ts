import { registerSW } from 'virtual:pwa-register'
import { refreshTokenSilently } from '@app/shared/auth'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { applyDefaultTheme } from '@app/utils/theme'

// Set up shoelace icons
setBasePath('node_modules/@shoelace-style/shoelace/dist')

// Register service worker
registerSW({ immediate: true })

// Set up theme
applyDefaultTheme()

Promise.allSettled([
    await refreshTokenSilently(),
    import('./app/app-root.element'),
    customElements.whenDefined('app-root')
]).then(() => {
    document.querySelector('body')?.classList.remove('loading')
    document.querySelector('.loader')?.remove()
})


// import { registerSW } from 'virtual:pwa-register';
import { refreshTokenSilently } from '@app/shared/auth';
import { applyDefaultTheme } from '@app/utils/theme';

// Register service worker
// registerSW({ immediate: true })

// Set up theme
applyDefaultTheme();

// Refresh token silently
await refreshTokenSilently();

// Load app
Promise.allSettled([import('@app/app-root.element'), customElements.whenDefined('app-root')])
  .then(() => {
    document.querySelector('body')?.classList.remove('initializing');
    document.querySelector('.loader')?.remove();
  })
  .catch((error) => console.error(error));

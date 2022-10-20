export const loading = async (show = false) => {
    await import('../elements/app-loading-status.element')

    const loadingState = document.body.querySelector('app-loading-status')

    if (show && !loadingState) {
        const element = document.createElement('app-loading-status')
        document.body.appendChild(element)
    }

    if (!show && loadingState) {
        loadingState.remove()
    }
}

export const loading = async (show = false) => {
    await import('../elements/app-loading.element')

    const loadingState = document.body.querySelector('#loading-state')

    if (show && !loadingState) {
        const element = Object.assign(document.createElement('app-loading'), {
            id: 'loading-state'
        })
        document.body.appendChild(element)
    }

    if (!show && loadingState) {
        loadingState.remove()
    }
}

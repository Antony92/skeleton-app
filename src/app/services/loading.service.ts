export const loading = async (show = false) => {
    await import('../elements/app-loading.element')

    let element = document.body.querySelector('app-loading')

    if (show && !element) {
        element = document.createElement('app-loading')
        document.body.appendChild(element)
    } else if (!show && element) {
        element.remove()
    }
}

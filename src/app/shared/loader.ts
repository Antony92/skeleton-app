export const loading = async (show = false) => {
    await import('../elements/loader/app-loader.element')

    let element = document.body.querySelector('app-loader')

    if (show && !element) {
        element = document.createElement('app-loader')
        document.body.appendChild(element)
    } else if (!show && element) {
        element.remove()
    }
}

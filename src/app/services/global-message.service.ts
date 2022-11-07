export const showGlobalMessage = async (message: string, type: 'info' | 'warning' | 'danger' = 'info') => {
    await import('../elements/app-global-message.element')

    let element = document.body.querySelector('app-global-message')

    if (!element) {
        element = document.createElement('app-global-message')
        element.addEventListener('app-after-hide', () => element?.remove())

        document.body.appendChild(element)
        
        requestAnimationFrame(() => {
            element?.getBoundingClientRect()
            element?.show(message, type)
        })

    } else {
        element.show(message, type)
    }
}

export const hideGlobalMessage = () => {
    document.body.querySelector('app-global-message')?.hide()
}
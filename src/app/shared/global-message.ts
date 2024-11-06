/**
 * Show global message
 * @param message 
 * @param type 
 */
export const showGlobalMessage = async (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    await import('@app/elements/global-message/app-global-message.element')

    let element = document.body.querySelector('app-global-message')

    // If element exist just update message and type else create it and append to body 
    if (element) {
        element.show(message, type)
    } else {
        element = document.createElement('app-global-message')
        element.addEventListener('app-after-hide', () => element?.remove())

        document.body.appendChild(element)
        
        requestAnimationFrame(() => {
            element?.getBoundingClientRect()
            element?.show(message, type)
        })
    }
}

/**
 * Hide global message
 */
export const hideGlobalMessage = () => {
    document.body.querySelector('app-global-message')?.hide()
}
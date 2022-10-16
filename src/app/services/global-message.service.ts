export const showGlobalMessage = async (message: string, type: 'info' | 'warning' | 'danger' = 'info') => {
    await import('../elements/app-global-message.element')

    const globalMessage = document.body.querySelector('app-global-message')

    if (globalMessage) {
        globalMessage.show(message, type)
    } else {
        const element = document.createElement('app-global-message')
        element.addEventListener('app-after-hide', () => element.remove())

        document.body.appendChild(element)
        requestAnimationFrame(() => {
            element.getBoundingClientRect()
            element.show(message, type)
        })
        
    } 
}

export const removeGlobalMessage = () => {
    document.querySelector('app-global-message')?.remove()
}
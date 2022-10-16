export const showGlobalMessage = async (message: string, type: 'primary' | 'warning' | 'danger' = 'primary') => {

    removeGlobalMessage()

    const wrapper = document.createElement('div')
    const closeIcon = document.createElement('span')

    closeIcon.addEventListener('click', () => document.body.removeChild(wrapper))

    wrapper.id = 'global-message'
    wrapper.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        translate: -50%;
        z-index: 6;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--sl-shadow-x-large);
        padding: 20px;
        border-radius: 0.25rem;
        background-color: var(--sl-color-${type}-200);
    `
    closeIcon.style.cssText = `cursor: pointer;`

    wrapper.textContent = message
    closeIcon.textContent = '✕'

    wrapper.appendChild(closeIcon)

    document.body.appendChild(wrapper)
}

export const removeGlobalMessage = () => {
    const globalMessage = document.querySelector('#global-message')
    if (globalMessage) document.body.removeChild(globalMessage)
}
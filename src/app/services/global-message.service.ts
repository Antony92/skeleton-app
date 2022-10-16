export const showGlobalMessage = async (message: string, type: 'info' | 'warning' | 'danger' = 'info') => {
    await import('@shoelace-style/shoelace/dist/components/icon/icon.js')

    const globalMessage = document.querySelector('#global-message')

    if (globalMessage) document.body.removeChild(globalMessage)

    const wrapper = document.createElement('div')
    const closeIcon = Object.assign(document.createElement('sl-icon'), { name: 'x-lg'})

    wrapper.id = 'global-message'

    wrapper.appendChild(closeIcon)

    document.body.appendChild(wrapper)
}
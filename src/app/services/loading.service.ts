export const loading = async (show = false) => {
    await import('@shoelace-style/shoelace/dist/components/spinner/spinner.js')

    const loadingState = document.body.querySelector('#loading-state')

    if (show && !loadingState) {
        const wrapper = document.createElement('div')
        const spinner = document.createElement('sl-spinner')
    
        wrapper.id = 'loading-state'
        wrapper.style.cssText = `
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: grid;
            align-items: center;
            justify-items: center;
            z-index: 10000;
        `
        spinner.style.cssText = `font-size: 3rem;`

        wrapper.appendChild(spinner)
        document.body.appendChild(wrapper)
    }

    if (!show && loadingState) {
        loadingState.remove()
    }
}

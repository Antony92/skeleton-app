export const loading = async (show = false) => {
	await import('@shoelace-style/shoelace/dist/components/spinner/spinner.js')

    const wrap = document.querySelector('#loading')

    if (show && !wrap) {
        const wrapper = document.createElement('div')
        const spinner = document.createElement('sl-spinner')
        wrapper.appendChild(spinner)
    
        wrapper.id = 'loading'
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
        `
        spinner.style.cssText = `font-size: 3rem;`

        document.body.append(wrapper)
    }

    if (!show && wrap) document.body.removeChild(wrap)
}

// Import Shoelace themes
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'

// Import main styles
import './main.css'

// Import root element
import './app/app-root.element'

// Theme utils
import { initTheme } from './app/utils/theme.js'

// Icon lib
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js'

// Load material icons
registerIconLibrary('material', {
	resolver: (name) => {
		const match = name.match(/^(.*?)(_(round|sharp))?$/)
		return `https://cdn.jsdelivr.net/npm/@material-icons/svg@1.0.5/svg/${match?.[1]}/${match?.[3] || 'outline'}.svg`
	},
	mutator: (svg) => svg.setAttribute('fill', 'currentColor'),
})

// set up theme
initTheme()

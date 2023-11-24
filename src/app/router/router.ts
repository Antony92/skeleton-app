import { TemplateResult } from 'lit'
import { URLPattern } from 'urlpattern-polyfill/urlpattern'

export type RouterConfig = {
	fallback: string
	routes: Route[]
	outlet: Element | null | undefined
}

export type Route = {
	path: string
	render: (context?: RouteContext) => TemplateResult
	canActivate?: ((context?: RouteContext) => Promise<boolean>)[]
	canDeactivate?: ((context?: RouteContext) => Promise<boolean>)[]
	beforeNavigation?: (context?: RouteContext) => Promise<void>
	afterNavigation?: (context?: RouteContext) => Promise<void>
	lazy?: (context?: RouteContext) => Promise<void>
	redirect?: string
	title?: string | ((context?: RouteContext) => string)
	data?: object
}

export type RouteContext = {
	params: object
	query: object
	url: URL
	title?: string
	data?: object
}

class RouteEvent extends Event {
	private context: RouteContext

	constructor(context: RouteContext) {
		super('route-changed')
		this.context = context
	}
}

export class Router extends EventTarget {
	private config: RouterConfig = {
		fallback: '/',
		routes: [],
		outlet: document.querySelector('#outlet'),
	}

	private context: RouteContext = {
		params: {},
		query: {},
		url: new URL(window.location.href),
	}

	constructor(config: RouterConfig) {
		super()
		this.config = config
		const routes = this.config.routes.map((route) => ({
			...route,
			urlPattern: new URLPattern({
				pathname: route.path,
				baseURL: window.location.href,
				search: '*',
				hash: '*',
			}),
		}))
		window.navigation.addEventListener('navigate', async (event) => {
			if (!event.canIntercept || event.hashChange || event.downloadRequest || event.formData) return
			const url = new URL(event.destination.url)
			const route = routes.find((r) => r.urlPattern.test(url))
			if (route) {
				this.context = {
					query: Object.fromEntries(new URLSearchParams(url.search)) || {},
					params: route.urlPattern.exec(url)?.pathname?.groups ?? {},
					title: typeof route.title === 'function' ? route.title() : route.title,
					url
				}
				await route.beforeNavigation?.(this.context)
				await route.lazy?.(this.context)
			} else {
				event.preventDefault()
				return
			}
		})
	}


	static navigate(path: string, options?: NavigationNavigateOptions) {
		return window.navigation.navigate(path, options)
	}

	static back(options?: NavigationNavigateOptions) {
		return window.navigation.back(options)
	}

	static reload(options?: NavigationNavigateOptions) {
		return window.navigation.reload(options)
	}
}

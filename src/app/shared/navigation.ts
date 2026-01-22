import { render } from 'lit'
import { confirmDialog } from '@app/shared/dialog'
import { loading } from '@app/shared/loader'

/* Internal Router State */

const state: State = {
	hasUnsavedChanges: false,
	currentRoute: null,
	options: null,
}

/* Public API */

export const initializeNavigation = (options: NavigationOptions) => {
	// 1. Pre-compile patterns for performance
	options.routes = options.routes.map((route) => ({
		...route,
		pattern: route.pattern ?? new URLPattern({ pathname: route.path }),
	}))

	state.options = options

	// 2. Setup listeners
	window.navigation.addEventListener('navigate', onNavigation)
	window.navigation.addEventListener('navigatesuccess', onNavigationSuccess)
	window.navigation.addEventListener('navigateerror', onNavigationError)

	// 3. Handle first load
	handleInitialLoad()
}

export const destroyNavigation = () => {
	window.navigation.removeEventListener('navigate', onNavigation)
	window.navigation.removeEventListener('navigatesuccess', onNavigationSuccess)
	window.navigation.removeEventListener('navigateerror', onNavigationError)
}

export const navigate = (url: string) => window.navigation.navigate(url)

export const pageHasUnsavedChanges = (value = true) => (state.hasUnsavedChanges = value)

export const getRouteParams = (): RouteParams => {
	return state.currentRoute?.pattern?.exec(location.href)?.pathname.groups || {}
}

/* Internal Logic */

const findRoute = (url: string) => {
	return state.options?.routes.find((r) => r.pattern?.test(url))
}

const handleInitialLoad = async () => {
	if (!state.options) return

	const url = new URL(location.href)
	const route = findRoute(url.href)

	if (!route) return
	if (route.redirect) return navigate(route.redirect)

	state.currentRoute = route
	await interceptHandler(url, route, state.options.outlet)
}

const onNavigation = async (event: NavigateEvent) => {
	if (shouldNotIntercept(event) || !state.options) return

	const url = new URL(event.destination.url)
	const currentEntry = window.navigation.currentEntry

	// Avoid redundant navigation
	if (event.destination.url === currentEntry?.url) {
		return event.preventDefault()
	}

	const route = findRoute(url.href)
	if (!route) return

	// Handle Redirects
	if (route.redirect) {
		event.preventDefault()
		return navigate(route.redirect)
  }

	// Handle Unsaved Changes
	if (state.hasUnsavedChanges) {
		event.preventDefault()
		const confirm = await confirmDialog({
			header: 'Unsaved Changes',
			message: 'You have unsaved changes. Are you sure you want to leave?',
		})
		if (confirm) {
			state.hasUnsavedChanges = false
			navigate(url.href)
		}
		return
	}

	state.currentRoute = route
  loading(true)

	event.intercept({
		handler: () => interceptHandler(url, route, state.options!.outlet),
	})
}

const onNavigationSuccess = () => {
	loading(false)
}

const onNavigationError = () => {
	loading(false)
}

const interceptHandler = async (url: URL, route: Route, outlet: HTMLElement) => {
	const params = route.pattern?.exec(url.href)?.pathname.groups || {}

	// 1. Guard check
	if (route.guard && !(await route.guard(url, params))) {
		loading(false)
		return
	}

	// 2. Enter hook
	if (route.enter) await route.enter(url, params)

	// 3. Render
	if (route.render) {
		render(route.render(url, params), outlet)
	}
}

const shouldNotIntercept = (event: NavigateEvent) => {
	return event.navigationType === 'reload' || !event.canIntercept || event.hashChange || event.downloadRequest || !!event.formData
}

/* Types */

export type RouteParams = Record<string, string | undefined>

export type Route = {
	name?: string
	path: string
	redirect?: string
	pattern?: URLPattern // Now pre-populated
	render?: (url: URL, params: RouteParams) => unknown
	enter?: (url: URL, params: RouteParams) => Promise<void> | void
	guard?: (url: URL, params: RouteParams) => Promise<boolean> | boolean
}

export type NavigationOptions = {
	outlet: HTMLElement
	routes: Route[]
}

type State = {
  hasUnsavedChanges: boolean,
	currentRoute: Route | null,
	options: NavigationOptions | null,
}

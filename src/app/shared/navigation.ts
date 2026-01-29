import { render } from 'lit'
import { confirmDialog } from '@app/shared/dialog'
import { loading } from '@app/shared/loader'
import type { SearchParams } from '@app/types/search.type'

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
	navigation.addEventListener('navigate', onNavigation)
	navigation.addEventListener('navigatesuccess', onNavigationSuccess)
	navigation.addEventListener('navigateerror', onNavigationError)

	// 3. Handle first load
	handleInitialLoad()
}

export const destroyNavigation = () => {
	navigation.removeEventListener('navigate', onNavigation)
	navigation.removeEventListener('navigatesuccess', onNavigationSuccess)
	navigation.removeEventListener('navigateerror', onNavigationError)
}

export const navigate = (url: string) => navigation.navigate(url)

export const pageHasUnsavedChanges = (value = true) => (state.hasUnsavedChanges = value)

export const getRouteParams = (): RouteParams => {
	return state.currentRoute?.pattern?.exec(location.href)?.pathname.groups || {}
}

export const getRouteSearch = () => {
	return Object.fromEntries(new URLSearchParams(location.search))
}

export const getRouteSearchMap = () => {
	const object = Object.fromEntries(new URLSearchParams(location.search))
	return new Map(Object.entries(object))
}

export const addSearchToRoute = (params: SearchParams) => {
	const search = new URLSearchParams()
	Object.entries(params).forEach(([key, value]) => {
		if (value != null && value !== '') {
			search.set(key, String(value))
		}
	})
	const query = search.toString()
	if (query) {
		navigation.navigate(`${location.pathname}?${query}`, { history: 'replace' })
	}
}

export const clearRouteSearch = () => {
	navigation.navigate(location.pathname, { history: 'replace' })
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
	if (route.redirect) {
		navigate(route.redirect)
		return
	}

	state.currentRoute = route
	await interceptHandler(url, route, state.options.outlet)
}

const onNavigation = async (event: NavigateEvent) => {
	if (shouldNotIntercept(event) || !state.options) return
	const url = new URL(event.destination.url)
	const currentEntry = navigation.currentEntry

	// Avoid redundant navigation
	if (event.destination.url === currentEntry?.url) {
		event.preventDefault()
		return
	}

	const route = findRoute(url.href)
	if (!route) return

	// Handle Redirects
	if (route.redirect) {
		event.preventDefault()
		navigate(route.redirect)
		return
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
		focusReset: 'manual',
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
	pattern?: URLPattern
	render?: (url: URL, params: RouteParams) => unknown
	enter?: (url: URL, params: RouteParams) => Promise<void> | void
	guard?: (url: URL, params: RouteParams) => Promise<boolean> | boolean
}

export type NavigationOptions = {
	outlet: HTMLElement
	routes: Route[]
}

type State = {
	hasUnsavedChanges: boolean
	currentRoute: Route | null
	options: NavigationOptions | null
}

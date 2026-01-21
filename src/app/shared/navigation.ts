import { render } from 'lit'
import { URLPattern } from 'urlpattern-polyfill/urlpattern'
import { confirmDialog } from '@app/shared/dialog'

let hasUnsavedChanges = false
let currentRoute: Route | null = null

export const initializeNavigation = (options: NavigationOptions) => {
	handleInitialLoad(options)
	window.navigation.addEventListener('navigate', (event) => onNavigation(event, options))
	window.navigation.addEventListener('navigatesuccess', (event) => onNavigationSuccess(event, options))
	window.navigation.addEventListener('navigateerror', (event) => onNavigationError(event, options))
}

const onNavigation = async (event: NavigateEvent, options: NavigationOptions) => {
	if (shouldNotIntercept(event)) {
		return
	}
	const url = new URL(event.destination.url)
	const currentEntry = window.navigation.currentEntry
	const destination = event.destination
	const { routes, outlet } = options

	if (destination.url === currentEntry?.url) {
		event.preventDefault()
		return
	}

	const route = routes.find((route) => {
		if (!route.pattern) {
			route.pattern = new URLPattern({ pathname: route.path })
		}
		return route.pattern.test(url.href)
	})

	if (!route) {
		return
	}

	if (route.redirect) {
		event.preventDefault()
		return navigate(route.redirect)
	}

	if (hasUnsavedChanges) {
		event.preventDefault()
		return handleUnsavedChanges(url)
	}

	currentRoute = route

	event.intercept({
		handler: () => interceptHandler(url, route, outlet),
	})
}

const onNavigationSuccess = (event: Event, options: NavigationOptions) => {
	const navigation = event.target as Navigation
	const url = new URL(navigation.currentEntry?.url || '')
	// TODO
}

const onNavigationError = (event: Event, options: NavigationOptions) => {
	const navigation = event.target as Navigation
	const url = new URL(navigation.currentEntry?.url || '')
	// TODO
}

const interceptHandler = async (url: URL, route: Route, outlet: HTMLElement) => {
	const params = route.pattern?.exec(url.href)?.pathname.groups || {}
	if (route.guard && !(await route.guard(url, params))) {
		return
	}
	if (route.enter) {
		await route.enter(url, params)
	}
	if (route.render) {
		render(route.render(url, params), outlet)
	}
}

const handleUnsavedChanges = async (url: URL) => {
	const confirm = await confirmDialog({ header: 'Confirm', message: 'You have unsaved changes. Are you sure you want to leave the page?' })
	if (confirm) {
    hasUnsavedChanges = false
		navigate(url.href)
	}
}

const handleInitialLoad = (options: NavigationOptions) => {
	const { routes, outlet } = options
	const url = new URL(location.href)

	const route = routes.find((route) => {
		if (!route.pattern) {
			route.pattern = new URLPattern({ pathname: route.path })
		}
		return route.pattern.test(url.href)
	})

	if (!route) {
		return
	}

	if (route.redirect) {
		return navigate(route.redirect)
	}

	currentRoute = route

	interceptHandler(url, route, outlet)
}

const shouldNotIntercept = (event: NavigateEvent) => {
	return (
		// Vite Hot Reload
		!event.userInitiated ||
		!event.canIntercept ||
		// If this is just a hashChange,
		// just let the browser handle scrolling to the content.
		event.hashChange ||
		// If this is a download,
		// let the browser perform the download.
		event.downloadRequest ||
		// If this is a form submission,
		// let that go to the server.
		event.formData
	)
}

export const navigate = (url: string) => {
	window.navigation.navigate(url)
}

export const pageHasUnsavedChanges = (hasChanges = true) => (hasUnsavedChanges = hasChanges)

export const getRouteParams = () => {
	return currentRoute?.pattern?.exec(location.href)?.pathname.groups || {}
}

export type Route = {
	name?: string
	path: string
	redirect?: string
	pattern?: URLPattern
	render?: (url: URL, params: RouteParams) => unknown
	enter?: (url: URL, params: RouteParams) => Promise<void> | void
	guard?: (url: URL, params: RouteParams) => Promise<boolean> | boolean
}

export type RouteParams = { [key: string]: string | undefined }
type NavigationOptions = { outlet: HTMLElement; routes: Route[] }

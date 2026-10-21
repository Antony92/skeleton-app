import type { AppDialog } from '@app/elements/dialog/app-dialog.element';
import { confirmDialog } from '@app/shared/dialogs';
import type { SearchParams } from '@app/types/search.type';
import { render } from 'lit';

let outlet: HTMLElement | undefined;
let routes: Route[] = [];

/* Internal Router State */

const state: RouterState = {
  hasUnsavedChanges: false,
  currentRoute: null,
};

/* Public API */

/**
 * Initializes the navigation system, compiles route patterns,
 * attaches navigation event listeners, and handles the initial load.
 */
export const initializeNavigation = (options: NavigationOptions) => {
  // 1. Pre-compile patterns for performance
  routes = options.routes.map((route) => ({
    ...route,
    pattern: route.pattern ?? new URLPattern({ pathname: route.path }),
  }));
  outlet = options.outlet;

  // 2. Setup listeners
  navigation.addEventListener('navigate', onNavigation);
  navigation.addEventListener('navigatesuccess', onNavigationSuccess);
  navigation.addEventListener('navigateerror', onNavigationError);
  window.addEventListener('beforeunload', onBeforeUnload);

  // 3. Handle first load
  void handleInitialLoad();
};

/**
 * Cleans up and removes all global navigation and window event listeners.
 */
export const destroyNavigation = () => {
  navigation.removeEventListener('navigate', onNavigation);
  navigation.removeEventListener('navigatesuccess', onNavigationSuccess);
  navigation.removeEventListener('navigateerror', onNavigationError);
  window.removeEventListener('beforeunload', onBeforeUnload);
};

/**
 * Programmatically triggers a navigation to a new URL using the Navigation API.
 */
export const navigate = (url: string | URL, options?: NavigationNavigateOptions) =>
  navigation.navigate(url, options);

/**
 * Updates or checks the global unsaved changes status flag.
 */
export const pageHasUnsavedChanges = (value = true) => (state.hasUnsavedChanges = value);

/**
 * Extracts and returns route parameter groups from the current URL path.
 */
export const getRouteParams = (): RouteParams => {
  return state.currentRoute?.pattern?.exec(location.href)?.pathname.groups || {};
};

/**
 * Parses and returns the current URL search parameters as a standard key-value object.
 */
export const getRouteSearch = () => {
  return Object.fromEntries(new URLSearchParams(location.search));
};

/**
 * Parses and returns the current URL search parameters as a JavaScript Map.
 */
export const getRouteSearchMap = () => {
  return new Map(new URLSearchParams(location.search).entries());
};

/**
 * Adds or updates search query parameters in the current URL and replaces the history state.
 */
export const addSearchToRoute = (params: SearchParams, clear = true) => {
  const search = new URLSearchParams(clear ? '' : location.search);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.size > 0 ? `?${search.toString()}` : '';
  navigation.navigate(`${location.pathname}${query}`, { history: 'replace' });
};

/**
 * Clears specified parameters or all query parameters from the current URL search string.
 */
export const clearRouteSearch = (params?: string[]) => {
  let path = location.pathname;
  if (params) {
    const search = new URLSearchParams(location.search);
    params.forEach((param) => {
      search.delete(param);
    });
    const query = search.size > 0 ? `?${search.toString()}` : '';
    path += query;
  }
  navigation.navigate(path, { history: 'replace' });
};

/* Internal Logic */

/**
 * Finds and returns the first registered route matching the provided URL.
 */
const findRoute = (url: string) => {
  return routes.find((r) => r.pattern?.test(url));
};

/**
 * Window beforeunload event listener to warn users about unsaved changes.
 */
const onBeforeUnload = (event: BeforeUnloadEvent) => {
  if (state.hasUnsavedChanges && event.cancelable) {
    event.preventDefault();
  }
};

/**
 * Handles the initial page load by matching the current URL and executing route hooks/rendering.
 */
const handleInitialLoad = async () => {
  const url = new URL(location.href);
  const route = findRoute(url.href);

  if (!route) return;
  if (route.redirect) {
    navigate(route.redirect, { history: 'replace' });
    return;
  }

  await interceptHandler(url, route, outlet);
};

/**
 * Prompts the user via confirmation dialog when navigating away with unsaved changes.
 */
const handleUnsavedChanges = async (event: NavigateEvent) => {
  const confirm = await confirmDialog({
    header: 'Unsaved Changes',
    message: 'You have unsaved changes. Are you sure you want to leave?',
  });
  if (!confirm) return;
  state.hasUnsavedChanges = false;
  if (event.navigationType === 'traverse' && event.destination.key) {
    navigation.traverseTo(event.destination.key);
  } else {
    navigate(event.destination.url, {
      history: event.navigationType === 'replace' ? 'replace' : 'auto',
    });
  }
};

/**
 * Resets the unsaved changes state flag and closes any open confirmation dialogs.
 */
const resetUnsavedChanges = () => {
  state.hasUnsavedChanges = false;
  void document.querySelector<AppDialog>('#confirm-dialog')?.close();
};

/**
 * Intercepts navigation events to manage redirects, guards, and unsaved changes confirmation.
 */
const onNavigation = (event: NavigateEvent) => {
  if (shouldNotIntercept(event)) return;
  const url = new URL(event.destination.url);
  const currentEntry = navigation.currentEntry;

  // Avoid redundant navigation
  if (
    event.destination.url === currentEntry?.url &&
    event.destination.getState() === currentEntry?.getState() &&
    event.cancelable
  ) {
    event.preventDefault();
    return;
  }

  const route = findRoute(url.href);
  if (!route) return;

  // Handle Redirects
  if (route.redirect && event.cancelable) {
    event.preventDefault();
    navigate(route.redirect, { history: 'replace' });
    return;
  }

  // Handle Unsaved Changes
  if (state.hasUnsavedChanges && event.cancelable) {
    event.preventDefault();
    void handleUnsavedChanges(event);
    return;
  } else {
    resetUnsavedChanges();
  }

  // init animation if any

  event.intercept({
    handler: () => interceptHandler(url, route, outlet, event.signal),
    focusReset: 'manual',
  });
};

/**
 * Callback executed when a navigation operation completes successfully.
 */
const onNavigationSuccess = () => {
  // TODO remove animation
};

/**
 * Callback executed when a navigation operation fails or encounters an error.
 */
const onNavigationError = () => {
  // TODO remove animation
};

/**
 * Sequentially executes route guards, runs enter hooks, and renders the route component into the outlet.
 */
const interceptHandler = async (
  url: URL,
  route: Route,
  outlet?: HTMLElement,
  signal?: AbortSignal,
) => {
  const params = route.pattern?.exec(url.href)?.pathname.groups || {};

  // 1. Guard check (run sequentially)
  if (route.guards) {
    for (const guard of route.guards) {
      if (signal?.aborted) return;
      const passed = await guard(url, params);
      if (!passed) {
        // TODO remove animation
        return;
      }
    }
  }

  if (signal?.aborted) return;

  // 2. Commit current route after guards pass
  state.currentRoute = route;

  // 3. Enter hook
  if (route.enter) await route.enter(url, params);
  if (signal?.aborted) return;

  // 4. Render
  if (route.render && outlet) {
    render(route.render(url, params), outlet);
  }
};

/**
 * Determines whether a navigation event should be ignored (e.g. reloads, hash changes, downloads).
 */
const shouldNotIntercept = (event: NavigateEvent) => {
  return (
    event.navigationType === 'reload' ||
    !event.canIntercept ||
    event.hashChange ||
    event.downloadRequest ||
    !!event.formData
  );
};

/* Types */

export type RouteParams = Record<string, string | undefined>;

export type Route = {
  name?: string;
  path: string;
  redirect?: string;
  pattern?: URLPattern;
  render?: (url: URL, params: RouteParams) => unknown;
  enter?: (url: URL, params: RouteParams) => Promise<void> | void;
  guards?: ((url: URL, params: RouteParams) => Promise<boolean> | boolean)[];
};

export type NavigationOptions = {
  outlet: HTMLElement;
  routes: Route[];
};

type RouterState = {
  hasUnsavedChanges: boolean;
  currentRoute: Route | null;
};

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

export const destroyNavigation = () => {
  navigation.removeEventListener('navigate', onNavigation);
  navigation.removeEventListener('navigatesuccess', onNavigationSuccess);
  navigation.removeEventListener('navigateerror', onNavigationError);
  window.removeEventListener('beforeunload', onBeforeUnload);
};

export const navigate = (url: string | URL, options?: NavigationNavigateOptions) =>
  navigation.navigate(url, options);

export const pageHasUnsavedChanges = (value = true) => (state.hasUnsavedChanges = value);

export const getRouteParams = (): RouteParams => {
  return state.currentRoute?.pattern?.exec(location.href)?.pathname.groups || {};
};

export const getRouteSearch = () => {
  return Object.fromEntries(new URLSearchParams(location.search));
};

export const getRouteSearchMap = () => {
  return new Map(new URLSearchParams(location.search).entries());
};

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

export const clearRouteSearch = (params?: SearchParams | string[]) => {
  let path = location.pathname;
  if (params) {
    const search = new URLSearchParams(location.search);
    const keys = Array.isArray(params) ? params : Object.keys(params);
    keys.forEach((key) => {
      search.delete(key);
    });
    const query = search.size > 0 ? `?${search.toString()}` : '';
    path += query;
  }
  navigation.navigate(path, { history: 'replace' });
};

/* Internal Logic */

const findRoute = (url: string) => {
  return routes.find((r) => r.pattern?.test(url));
};

const onBeforeUnload = (event: BeforeUnloadEvent) => {
  if (state.hasUnsavedChanges) {
    event.preventDefault();
  }
};

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
  }

  // init animation if any

  event.intercept({
    handler: () => interceptHandler(url, route, outlet, event.signal),
    focusReset: 'manual',
  });
};

const onNavigationSuccess = () => {
  // TODO remove animation
};

const onNavigationError = () => {
  // TODO remove animation
};

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

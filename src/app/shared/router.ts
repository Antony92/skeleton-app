import { Route, Router } from '@vaadin/router'
import { Role } from '@app/types/user.type'
import { authGuard } from '@app/shared/auth-guard'

const routes: Route[] = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/home',
		component: 'app-home',
		action: async (context, command) => {
			await import('@app/pages/app-home.page')
		},
	},
	{
		path: '/demo',
		children: [
			{
				path: '/',
				component: 'app-demo',
				action: async (context, command) => {
					await import('@app/pages/app-demo.page')
				},
			},
		],
	},
	{
		path: '/feedback',
		action: authGuard(),
		children: [
			{
				path: '/',
				component: 'app-feedback',
				action: async (context, command) => {
					await import('@app/pages/app-feedback.page')
				},
			},
		],
	},
	{
		path: '/admin',
		action: authGuard([Role.ADMIN]),
		children: [
			{
				path: '/',
				component: 'app-admin',
				action: async (context, command) => {
					await import('@app/pages/admin/app-admin.page')
				},
			},
			{
				path: '/server-events',
				component: 'app-ad-server-events',
				action: async (context, command) => {
					await import('@app/pages/admin/app-ad-server-events.page')
				},
			},
			{
				path: '/users',
				component: 'app-ad-users',
				action: async (context, command) => {
					await import('@app/pages/admin/app-ad-users.page')
				},
			},
			{
				path: '/audit-logs',
				component: 'app-ad-audit-logs',
				action: async (context, command) => {
					await import('@app/pages/admin/app-ad-audit-logs.page')
				},
			},
		],
	},
	{
		path: '/login',
		component: 'app-login',
		action: async (context, command) => {
			await import('@app/pages/app-login.page')
		},
	},
	{
		path: '/profile',
		action: authGuard(),
		children: [
			{
				path: '/',
				component: 'app-profile',
				action: async (context, command) => {
					await import('@app/pages/app-profile.page')
				},
			},
		],
	},
	{
		path: '(.*)',
		component: 'app-not-found',
		action: async (context, command) => {
			await import('@app/pages/app-not-found.page')
		},
	},
]

export const initializeRouter = async (outlet: HTMLElement) => {
	const router = new Router(outlet)
	await router.setRoutes(routes)
}

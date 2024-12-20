import { Route, Router } from '@vaadin/router'
import { Role } from '@app/types/user.type'
import { authGuard } from '@app/shared/auth-guard'
import { hasUserRole } from './auth'

const routes: Route[] = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/home',
		component: 'app-home-page',
		action: async (context, command) => {
			await import('@app/pages/app-home.page')
		},
	},
	{
		path: '/demo',
		children: [
			{
				path: '/',
				component: 'app-demo-page',
				action: async (context, command) => {
					await import('@app/pages/app-demo.page')
				},
			},
		],
	},
	{
		path: '/table',
		children: [
			{
				path: '/',
				component: 'app-table-page',
				action: async (context, command) => {
					await import('@app/pages/app-table.page')
				},
			},
		],
	},
	{
		path: '/form',
		children: [
			{
				path: '/',
				component: 'app-form-page',
				action: async (context, command) => {
					await import('@app/pages/app-form.page')
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
					const canActivate = await hasUserRole([Role.GUEST])
					if (!canActivate) {
						return command.redirect('/page-not-found')
					}
					await import('@app/pages/admin/app-ad-audit-logs.page')
				},
			},
		],
	},
	{
		path: '/login',
		component: 'app-login-page',
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
				component: 'app-profile-page',
				action: async (context, command) => {
					await import('@app/pages/app-profile.page')
				},
			},
		],
	},
	{
		path: '(.*)',
		component: 'app-not-found-page',
		action: async (context, command) => {
			await import('@app/pages/app-not-found.page')
		},
	},
]

export const initializeRouter = async (outlet: HTMLElement) => {
	const router = new Router(outlet)
	await router.setRoutes(routes)
}

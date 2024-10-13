import { Route, Router } from '@vaadin/router'
import { Role } from '../types/user.type'
import { authGuard } from '../shared/auth-guard'

const routes: Route[] = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/home',
		component: 'app-home',
		action: async (context, command) => {
			await import('../pages/app-home.page')
		},
	},
	{
		path: '/feedback',
		action: authGuard(),
		children: [
			{
				path: '/',
				component: 'app-feedback',
				action: async (context, command) => {
					await import('../pages/app-feedback.page')
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
					await import('../pages/admin/app-admin.page')
				},
			},
			{
				path: '/server-events',
				component: 'app-ad-server-events',
				action: async (context, command) => {
					await import('../pages/admin/app-ad-server-events.page')
				},
			},
			{
				path: '/users',
				component: 'app-ad-users',
				action: async (context, command) => {
					await import('../pages/admin/app-ad-users.page')
				},
			},
			{
				path: '/audit-logs',
				component: 'app-ad-audit-logs',
				action: async (context, command) => {
					await import('../pages/admin/app-ad-audit-logs.page')
				},
			},
		],
	},
	{
		path: '/login',
		component: 'app-login',
		action: async (context, command) => {
			await import('../pages/app-login.page')
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
					await import('../pages/app-profile.page')
				},
			},
		],
	},
	{
		path: '(.*)',
		component: 'app-not-found',
		action: async (context, command) => {
			await import('../pages/app-not-found.page')
		},
	},
]

export const initializeRouter = (outlet: HTMLElement) => {
	const router = new Router(outlet)
	router.setRoutes(routes)
}

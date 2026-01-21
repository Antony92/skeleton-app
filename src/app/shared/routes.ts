import { html } from 'lit/static-html.js'
import type { Route } from '@app/shared/navigation'
import { authGuard } from './guard'
import { Role } from '@app/types/user.type'

export const routes: Route[] = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/home',
		render: () => html`<app-home-page></app-home-page>`,
		enter: async () => {
			await import('@app/pages/app-home.page')
		},
	},
	{
		path: '/demo',
		render: () => html`<app-demo-page></app-demo-page>`,
		enter: async () => {
			await import('@app/pages/app-demo.page')
		},
	},
	{
		path: '/table',
		render: () => html`<app-table-page></app-table-page>`,
		enter: async () => {
			await import('@app/pages/app-table.page')
		},
	},
	{
		path: '/form',
		render: () => html`<app-form-page></app-form-page>`,
		enter: async () => {
			await import('@app/pages/app-form.page')
		},
	},
	{
		path: '/admin',
		guard: authGuard([Role.ADMIN]),
		render: () => html`<app-admin-page></app-admin-page>`,
		enter: async () => {
			await import('@app/pages/admin/app-admin.page')
		},
	},
	{
		path: '/profile',
		guard: authGuard(),
		render: () => html`<app-profile-page></app-profile-page>`,
		enter: async () => {
			await import('@app/pages/app-profile.page')
		},
	},
	{
		path: '/login',
		render: () => html`<app-login-page></app-login-page>`,
		enter: async () => {
			await import('@app/pages/app-login.page')
		},
	},
	{
		path: '(.*)',
		render: () => html`<app-not-found-page></app-not-found-page>`,
		enter: async () => {
			await import('@app/pages/app-not-found.page')
		},
	},
]

import { authGuard } from '@app/shared/guards';
import type { Route } from '@app/shared/navigation';
import { Role } from '@app/types/user.type';
import { html } from 'lit/static-html.js';

export const routes: Route[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    render: () => html`<app-home-page></app-home-page>`,
    enter: async () => {
      await import('@app/pages/app-home.page');
    },
  },
  {
    path: '/demo',
    render: () => html`<app-demo-page></app-demo-page>`,
    enter: async () => {
      await import('@app/pages/app-demo.page');
    },
  },
  {
    path: '/table',
    render: () => html`<app-table-page></app-table-page>`,
    enter: async () => {
      await import('@app/pages/app-table.page');
    },
  },
  {
    path: '/test/:id',
    render: () => html`<app-test-page></app-test-page>`,
    enter: async () => {
      await import('@app/pages/app-test.page');
    },
  },
  {
    path: '/form',
    render: () => html`<app-form-page></app-form-page>`,
    enter: async () => {
      await import('@app/pages/app-form.page');
    },
  },
  {
    path: '/drag-and-drop',
    render: () => html`<app-drag-drop-page></app-drag-drop-page>`,
    enter: async () => {
      await import('@app/pages/app-drag-drop.page');
    },
  },
  {
    path: '/admin',
    guards: [authGuard([Role.ADMIN])],
    render: () => html`<app-admin-page></app-admin-page>`,
    enter: async () => {
      await import('@app/pages/admin/app-admin.page');
    },
  },
  {
    path: '/admin/users',
    guards: [authGuard([Role.ADMIN])],
    render: () => html`<app-users-page></app-users-page>`,
    enter: async () => {
      await import('@app/pages/admin/app-users.page');
    },
  },
  {
    path: '/admin/server-events',
    guards: [authGuard([Role.ADMIN])],
    render: () => html`<app-server-events-page></app-server-events-page>`,
    enter: async () => {
      await import('@app/pages/admin/app-server-events.page');
    },
  },
  {
    path: '/admin/audit-logs',
    guards: [authGuard([Role.ADMIN])],
    render: () => html`<app-audit-logs-page></app-audit-logs-page>`,
    enter: async () => {
      await import('@app/pages/admin/app-audit-logs.page');
    },
  },
  {
    path: '/profile',
    guards: [authGuard()],
    render: () => html`<app-profile-page></app-profile-page>`,
    enter: async () => {
      await import('@app/pages/app-profile.page');
    },
  },
  {
    path: '/login',
    render: () => html`<app-login-page></app-login-page>`,
    enter: async () => {
      await import('@app/pages/app-login.page');
    },
  },
  {
    path: '(.*)',
    render: () => html`<app-not-found-page></app-not-found-page>`,
    enter: async () => {
      await import('@app/pages/app-not-found.page');
    },
  },
];

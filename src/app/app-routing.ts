import { Route } from '@angular/router';

export const appRoutes = [
  { path: '', redirectTo: '/login/login-form', pathMatch: 'full' },
  { path: 'login', data: { preload: true }, loadChildren: () => import('./pages/login/login-routing') },
  { path: 'default', data: { preload: true }, loadChildren: () => import('./layout/base-routing') },
  { path: 'redirect', loadChildren: () => import('./pages/wildcard/wildcard-routing') },
  { path: '**', redirectTo: '/redirect/not-found', pathMatch: 'full' }
] as Route[];

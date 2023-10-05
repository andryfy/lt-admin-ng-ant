import { Route } from '@angular/router';

export const appRoutes = [
  { path: '', redirectTo: '/login/login-form', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./layout/base-routing') },
  { path: 'login', data: { preload: true }, loadChildren: () => import('./modules/default/pages/login/login-routing') },
  { path: 'redirect', loadChildren: () => import('./modules/default/pages/wildcard/wildcard-routing') },
  { path: '**', redirectTo: '/redirect/not-found', pathMatch: 'full' }
] as Route[];

import { Route } from '@angular/router';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { NotFoundComponent } from './not-found/not-found.component';

export default [
  {
    path: 'not-found',
    data: { preload: true, title: 'Not found page', key: 'not-found' },
    component: NotFoundComponent
  },
  {
    path: 'maintenance',
    data: { title: 'Maintenance page', key: 'maintenance' },
    component: MaintenanceComponent
  }
] as Route[];

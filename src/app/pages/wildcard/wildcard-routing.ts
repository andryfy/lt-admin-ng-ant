import { Route } from '@angular/router';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { NotFoundComponent } from './not-found/not-found.component';

export default [
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  }
] as Route[];

import { Route } from '@angular/router';

import { JudgeAuthGuard } from '@core/services/common/guard/judgeAuth.guard';
import { JudgeLoginGuard } from '@core/services/common/guard/judgeLogin.guard';

import { BaseComponent } from './base.component';

export default [
  {
    path: '',
    component: BaseComponent,
    data: { shouldDetach: 'no', preload: true },
    canActivateChild: [JudgeLoginGuard, JudgeAuthGuard],
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', data: { preload: true }, loadChildren: () => import('@default/default.module').then(m => m.DefaultModule) }
    ]
  }
] as Route[];

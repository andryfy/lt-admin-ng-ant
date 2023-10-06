import { InjectionToken } from '@angular/core';

import { ModuleOption } from '@app/core/services/types';
import { defaultModuleOption } from '@app/modules/default/config';

// /!*Define module*!/
export const MODULE_TOKEN = new InjectionToken<ModuleOption[]>('module-token', {
  providedIn: 'root',
  factory(): ModuleOption[] {
    return configList;
  }
});

const configList: ModuleOption[] = [defaultModuleOption];

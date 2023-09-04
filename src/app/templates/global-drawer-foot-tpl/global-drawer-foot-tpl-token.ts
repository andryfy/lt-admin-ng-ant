// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken, TemplateRef } from '@angular/core';

import { GlobalDrawerFootTplComponent } from '@app/templates/global-drawer-foot-tpl/global-drawer-foot-tpl.component';
import { GlobalModalBtnTplComponent } from '@app/templates/global-modal-btn-tpl/global-modal-btn-tpl.component';

/**
 * The footer template of the global drawer, that is, the OK and Cancel buttons
 */
export const GLOBAL_DRAWER_FOOT_TPL_TOKEN = new InjectionToken<ComponentRef<GlobalDrawerFootTplComponent>>('drawer action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalDrawerFootTplComponent, {
      environmentInjector: injector
    });
    // Use the `ApplicationRef` instance to register the newly created ref to include the component view into the change detection cycle.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});

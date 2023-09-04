// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken } from '@angular/core';

import { GlobalModalBtnTplComponent } from '@app/templates/global-modal-btn-tpl/global-modal-btn-tpl.component';

/**
 * In the upper right corner of the global dialog box, expand the maximize function template
 */
export const GLOBAL_TPL_MODAL_ACTION_TOKEN = new InjectionToken<ComponentRef<GlobalModalBtnTplComponent>>('modal action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalModalBtnTplComponent, {
      environmentInjector: injector
    });
    // Register the newly created ref with an `ApplicationRef` instance to include the component view into the change detection cycle.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});

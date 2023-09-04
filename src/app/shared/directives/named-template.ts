import { Directive, Input, OnInit, TemplateRef } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * Get template name
 *
 * @example
 * ``` html
 * <ng-template named="test"></ng-template>
 * <ng-template #test named></ng-template>
 *
 * ```
 * ``` javascript
 * @Component(...)
 * export class TestComponent {
 *   @ViewChildren(NamedTemplate) list!: QueryList<NamedTemplate>;
 *
 *   trace() {
 *     this.list.forEach(it => {
 *       console.log(it.named);
 *       console.log(it.template);
 *     });
 *   }
 * }
 * ```
 */
@Directive({
  selector: 'ng-template[named]',
  standalone: true
})
export class NamedTemplate<T> implements OnInit {
  /**
   * Template Name
   */
  @Input({ required: true }) named!: string;
  constructor(public template: TemplateRef<T>) {}

  ngOnInit(): void {
    this.resolveName();
  }

  resolveName(): void {
    if (!this.named && this.template) {
      const tplRef = this.template as NzSafeAny;
      // localNames is an array, or null if there is no name
      this.named = tplRef._declarationTContainer.localNames?.[0];
    }
  }
}

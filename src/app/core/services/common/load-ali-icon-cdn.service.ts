import { Injectable } from '@angular/core';

import { NzIconService } from 'ng-zorro-antd/icon';

// Get Ali icon library
@Injectable({
  providedIn: 'root'
})
export class LoadAliIconCdnService {
  constructor(private iconService: NzIconService) {}

  load(): void {
    // You have to go to the official website of Alibaba Icon Library to generate this js yourself.
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_3303907_htrdo3n69kc.js'
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type componentName = 'Search List (Articles)' | 'Search List (Projects)' | 'Search List (Apps)';

// This is the store that caches the search list and belongs to the business store.
@Injectable({
  providedIn: 'root'
})
export class SearchListStoreService {
  private SearchListComponentStore = new Subject<componentName>();

  constructor() {}

  setCurrentSearchListComponentStore(componentName: componentName): void {
    this.SearchListComponentStore.next(componentName);
  }

  getCurrentSearchListComponentStore(): Observable<componentName> {
    return this.SearchListComponentStore.asObservable();
  }
}

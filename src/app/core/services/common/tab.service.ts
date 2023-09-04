import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { getDeepReuseStrategyKeyFn, fnGetPathWithoutParam } from '@utils/tools';
import _ from 'lodash';

import { SimpleReuseStrategy } from './reuse-strategy';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

/*
 * Tab operation service
 * */
@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabArray$ = new BehaviorSubject<TabModel[]>([]);
  private tabArray: TabModel[] = [];
  private currSelectedIndexTab = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  getTabArray$(): Observable<TabModel[]> {
    return this.tabArray$.asObservable();
  }

  setTabArray$(tabArray: TabModel[]): void {
    this.tabArray$.next(tabArray);
  }

  setTabsSourceData(): void {
    this.setTabArray$(this.tabArray);
  }

  clearTabs(): void {
    this.tabArray = [];
    this.setTabsSourceData();
  }

  addTab(param: TabModel, isNewTabDetailPage = false): void {
    this.tabArray.forEach(tab => {
      // List details operations, such as clicking details on a user form and opening the details in the current tab, you can see online examples: "Query table" and "View button" in the table
      // The title must be the same as the title of the user form details component route
      if (tab.title === param.title && !isNewTabDetailPage) {
        // Store the component snapshots under each tab into the tab array, and perform deduplication operations below.
        tab.snapshotArray = _.uniqBy([...tab.snapshotArray, ...param.snapshotArray], item => {
          // @ts-ignore
          return item['_routerState'].url;
        });
        // When opening details on the current page, you need to replace the path of the corresponding tab.
        tab.path = param.path;
      }
    });
    if (!this.tabArray.find(value => value.path === param.path)) {
      this.tabArray.push(param);
    }
    this.setTabsSourceData();
  }

  getTabArray(): TabModel[] {
    return this.tabArray;
  }

  changeTabTitle(title: string): void {
    this.tabArray[this.getCurrentTabIndex()].title = title;
    this.setTabArray$(this.tabArray);
  }

  // Delete the cache in SimpleReuseStrategy.handlers in route reuse through key
  delReuseStrategy(snapshotArray: ActivatedRouteSnapshot[]): void {
    const beDeleteKeysArray = this.getSnapshotArrayKey(snapshotArray);
    // The beDeleteKey array saves the key of the relevant route to solve the problem of "when the current tab opens the details page" and generates "on which page (list page or list details page) click the close button, the clicked page (list or list) The details page of one) will be cleared, and the other will not be cleared" bug
    beDeleteKeysArray.forEach(item => {
      SimpleReuseStrategy.deleteRouteSnapshot(item);
    });
  }

  // Based on the route snapshot cached in the tab, construct the key for route reuse. For example: login{name:'zhangsan'}, so that the key+param form is cached in SimpleReuseStrategy.handlers.
  getSnapshotArrayKey(activatedArray: ActivatedRouteSnapshot[]): string[] {
    const temp: string[] = [];
    activatedArray.forEach(item => {
      const key = getDeepReuseStrategyKeyFn(item);
      temp.push(key);
    });
    return temp;
  }

  // Right-click the tab to remove all tabs on the right. The index is the index of the tab selected by the mouse.
  delRightTab(tabPath: string, index: number): void {
    // Get the tab to be deleted
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex > index;
    });
    // Remove all tabs to the right of the right-clicked tab
    this.tabArray.length = index + 1;
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    // If the index of the tab selected by the right mouse button is less than the index of the currently displayed tab, the tab being opened will also be deleted.
    if (index < this.currSelectedIndexTab) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.router.navigateByUrl(this.tabArray[index].path);
    }
    this.setTabsSourceData();
  }

  // Right click to remove all tabs on the left
  /*
   * @params index The index of the tab where the current mouse button is clicked
   * */
  delLeftTab(tabPath: string, index: number): void {
    // tab to be deleted
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex < index;
    });

    // Process the index relationship first
    if (this.currSelectedIndexTab === index) {
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab < index) {
      // If the index of the tab clicked by the mouse is greater than the current index, you need to put the path of the current page in waitDelete
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab > index) {
      this.currSelectedIndexTab = this.currSelectedIndexTab - beDelTabArray.length;
    }
    // remaining tabs
    this.tabArray = this.tabArray.splice(beDelTabArray.length);
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    this.setTabsSourceData();
    this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
  }

  // Right click on the tab and select "Remove other tabs"
  delOtherTab(path: string, index: number): void {
    // tab to be deleted
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex !== index;
    });

    // Process the tabs that should be displayed
    this.tabArray = [this.tabArray[index]];
    // Remove the cache of the tab to be deleted
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });

    // If the index of the tab selected by the mouse is not the index of the tab of the currently opened page, the key of the current page must be used as waitDelete to prevent the component displayed by the current tab from being cached after it is removed.
    if (index !== this.currSelectedIndexTab) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
    }
    this.router.navigateByUrl(path);
    this.setTabsSourceData();
  }

  // Click the x icon on the tab label to delete the tab action, or right-click the "delete current tab" action
  delTab(tab: TabModel, index: number): void {
    // Remove the currently displayed tab
    if (index === this.currSelectedIndexTab) {
      const seletedTabKey = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.tabArray.splice(index, 1);
      // Handle index relationships
      this.currSelectedIndexTab = index - 1 < 0 ? 0 : index - 1;
      // Jump to new tab
      this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
      // in reuse-strategy.ts Cache the current path in Cache. If it is the current path, the current route will not be cached.
      SimpleReuseStrategy.waitDelete = seletedTabKey;
    } else if (index < this.currSelectedIndexTab) {
      // If the tab index selected by the mouse is smaller than the currently displayed tab index, that is, the tab selected by the mouse is to the left of the current tab.
      this.tabArray.splice(index, 1);
      this.currSelectedIndexTab = this.currSelectedIndexTab - 1;
    } else if (index > this.currSelectedIndexTab) {
      // Remove the tab to the right of the current tab
      this.tabArray.splice(index, 1);
    }
    // This operation is to solve the problem of saving the status of the list page and the details page, for example, if there is a details page in the list page, it can only be removed.
    // Bug in the status of the closed tab of the current page
    //Delete the cached snapshot of the selected tab
    this.delReuseStrategy(tab.snapshotArray);
    this.setTabsSourceData();
  }

  findIndex(path: string): number {
    const current = this.tabArray.findIndex(tabItem => {
      return path === tabItem.path;
    });
    this.currSelectedIndexTab = current;
    return current;
  }

  getCurrentPathWithoutParam(urlSegmentArray: UrlSegment[], queryParam: { [key: string]: any }): string {
    const temp: string[] = [];
    // Get the value of all parameters
    const queryParamValuesArray = Object.values(queryParam);
    urlSegmentArray.forEach(urlSeqment => {
      // Remove the url fragment that represents the parameter
      if (!queryParamValuesArray.includes(urlSeqment.path)) {
        temp.push(urlSeqment.path);
      }
    });
    return `${temp.join('/')}`;
  }

  // Refresh
  refresh(): void {
    // Get the current routing snapshot
    let snapshot = this.activatedRoute.snapshot;
    const key = getDeepReuseStrategyKeyFn(snapshot);
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    let params: Params;
    let urlWithOutParam = ''; // This is the url without parameters
    // It is a route that passes parameters along the path and has parameters.
    if (Object.keys(snapshot.params).length > 0) {
      params = snapshot.params;
      // @ts-ignore
      urlWithOutParam = this.getCurrentPathWithoutParam(snapshot['_urlSegment'].segments, params);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([urlWithOutParam, ...Object.values(params)]);
      });
    } else {
      // It is a route that passes parameters to the query, or a route that has no parameters.
      params = snapshot.queryParams;
      const sourceUrl = this.router.url;
      const currentRoute = fnGetPathWithoutParam(sourceUrl);
      // It is the query parameter
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([currentRoute], { queryParams: params });
      });
    }
  }

  getCurrentTabIndex(): number {
    return this.currSelectedIndexTab;
  }
}

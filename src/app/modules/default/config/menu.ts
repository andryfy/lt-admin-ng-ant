import { ActionCode } from '@app/config/actionCode';
import { MenuOption } from '@app/core/services/types';

export const defaultMenu: MenuOption[] = [
  {
    menuName: 'Dashboard',
    id: 1,
    fatherId: 0,
    icon: 'dashboard',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/default/dashboard',
    code: 'default',
    children: [
      {
        id: 1,
        fatherId: 0,
        menuName: 'Analysis page',
        open: false,
        icon: 'area-chart',
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/dashboard/analysis'
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'Monitoring page',
        open: false,
        icon: 'radar-chart',
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/dashboard/monitor'
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'Workbench',
        open: false,
        icon: 'control',
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/dashboard/workbench'
      }
    ]
  },
  {
    menuName: 'Page',
    icon: 'appstore',
    open: false,
    id: 1,
    fatherId: 0,
    code: 'default',
    selected: false,
    menuType: 'C',
    path: '/default/page-demo',
    children: [
      {
        id: 1,
        fatherId: 0,
        menuName: 'Form page',
        icon: 'form',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/page-demo/form',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: 'Basic form',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'form',
            code: 'default',
            path: '/default/page-demo/form/base-form'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Step by step form',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'form',
            path: '/default/page-demo/form/step-form'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Advanced forms',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'form',
            path: '/default/page-demo/form/advanced-form'
          }
        ]
      },
      {
        menuName: 'List',
        icon: 'table',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'default',
        id: 1,
        fatherId: 0,
        path: '/default/page-demo/list',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: 'Search list',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'table',
            path: '/default/page-demo/list/search-list',
            children: [
              {
                id: 1,
                fatherId: 0,
                menuName: 'Search list (articles)',
                open: false,
                selected: false,
                menuType: 'C',
                icon: 'table',
                code: 'default',
                path: '/default/page-demo/list/search-list/article'
              },
              {
                id: 1,
                fatherId: 0,
                menuName: 'Search list (item)',
                open: false,
                selected: false,
                menuType: 'C',
                icon: 'table',
                code: 'default',
                path: '/default/page-demo/list/search-list/project'
              },
              {
                id: 1,
                fatherId: 0,
                menuName: 'Search List (Application)',
                open: false,
                selected: false,
                menuType: 'C',
                icon: 'table',
                code: 'default',
                path: '/default/page-demo/list/search-list/application'
              }
            ]
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Inquiry form',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'table',
            code: 'default',
            path: '/default/page-demo/list/search-table'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Tree table',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'table',
            code: 'default',
            path: '/default/page-demo/list/tree-list'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Standard form',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'table',
            code: 'default',
            path: '/default/page-demo/list/standard-table'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Card list',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'table',
            code: 'default',
            path: '/default/page-demo/list/card-table'
          }
        ]
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'Details page',
        icon: 'profile',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/page-demo/detail',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: 'Basic details page',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'profile',
            path: '/default/page-demo/detail/base-detail'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Advanced details page',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'profile',
            path: '/default/page-demo/detail/adv-detail'
          }
        ]
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'Results page',
        icon: 'check-circle',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/page-demo/result',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: 'Success page',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'check-circle',
            code: 'default',
            path: '/default/page-demo/result/success'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Failure page',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'check-circle',
            path: '/default/page-demo/result/fail'
          }
        ]
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'Exception page',
        icon: 'warning',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/page-demo/except',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: '403',
            open: false,
            code: 'default',
            selected: false,
            menuType: 'C',
            icon: 'warning',
            path: '/default/page-demo/except/except403'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: '404',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'warning',
            code: 'default',
            path: '/default/page-demo/except/except404'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: '500',
            open: false,
            selected: false,
            menuType: 'C',
            code: 'default',
            icon: 'warning',
            path: '/default/page-demo/except/except500'
          }
        ]
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'Personal page',
        icon: 'user',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'default',
        path: '/default/page-demo/personal',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: 'Personal center',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'user',
            code: 'default',
            path: '/default/page-demo/personal/personal-center'
          },
          {
            id: 1,
            fatherId: 0,
            menuName: 'Personal settings',
            open: false,
            code: 'default',
            selected: false,
            menuType: 'C',
            icon: 'user',
            path: '/default/page-demo/personal/personal-setting'
          }
        ]
      },
      {
        id: 1,
        fatherId: 0,
        menuName: 'graphical editor',
        icon: '',
        alIcon: 'icon-mel-help',
        open: false,
        code: 'default',
        selected: false,
        menuType: 'C',
        path: '/default/page-demo/flow',
        children: [
          {
            id: 1,
            fatherId: 0,
            menuName: 'Flow chart',
            open: false,
            selected: false,
            menuType: 'C',
            icon: 'highlight',
            path: '/default/page-demo/flow/flow-chat',
            code: 'default'
          }
        ]
      }
    ]
  },
  {
    id: 1,
    fatherId: 0,
    menuName: 'About',
    icon: 'solution',
    open: false,
    code: 'default',
    selected: false,
    menuType: 'C',
    path: '/default/about'
  }
];

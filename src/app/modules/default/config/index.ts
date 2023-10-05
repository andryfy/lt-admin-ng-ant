import { ModuleOption } from '@app/core/services/types';

import { defaultMenu } from './menu';

export const defaultModuleOption: ModuleOption = {
  code: 'default',
  name: 'LT Admin',
  menuList: defaultMenu,
  theme: {
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    isShowTab: true,
    colorWeak: false,
    greyTheme: false,
    splitNav: false,
    fixedTab: true,
    fixedHead: true,
    fixedLeftNav: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  }
};

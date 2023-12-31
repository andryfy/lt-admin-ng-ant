/* Define constant */

import { OptionInterface, ThemeOption } from '@app/core/services/types';

// The prefix of the request header token
export const TokenPrefix = 'Bearer ';
// Token Key
export const TokenKey = 'Authorization';
// Is it a dark mode key
export const IsNightKey = 'IsNightKey';
// Module setting key
export const ModuleOptionKey = 'ModuleOption';
// Theme setting key
export const ThemeOptionKey = 'ThemeOptionKey';
// Used to record whether it is loaded for the first time
export const IsFirstLogin = 'IsFirstLogin';
// Lock screen key
export const LockedKey = 'LockedKey';
// With salt
export const salt = 'EIpWsyfiy@R@X#qn17!StJNdZK1fFF8iV6ffN!goZkqt#JxO';

// Login timeout code, pop up login dialog box
export const loginTimeOutCode = 1012;
// Token error, log in again
export const tokenErrorCode = 1010;

// The left menu becomes the maximum width of over mode
export const SideCollapsedMaxWidth = 700;
// The top menu becomes the maximum width of over mode
export const TopCollapsedMaxWidth = 1244;

// Languages :
export const LangList: OptionInterface[] = [
  {
    label: 'Malagasy',
    value: 'mg-MG'
  },
  {
    label: 'French',
    value: 'fr-FR'
  },
  {
    label: 'English',
    value: 'en-US',
    selected: true
  },
  {
    label: 'Korean',
    value: 'ko-KO'
  },
  {
    label: 'German',
    value: 'nl-NL'
  }
];

// Default theme value
export const InitTheme: ThemeOption = {
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
};

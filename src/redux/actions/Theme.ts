import {
  TOGGLE_COLLAPSED_NAV,
  SIDE_NAV_STYLE_CHANGE,
  CHANGE_LOCALE,
  NAV_TYPE_CHANGE,
  TOP_NAV_COLOR_CHANGE,
  HEADER_NAV_COLOR_CHANGE,
  TOGGLE_MOBILE_NAV,
} from "../constants/Theme";

export function toggleCollapsedNav(navCollapsed: { [key: string]: boolean }) {
  return {
    type: TOGGLE_COLLAPSED_NAV,
    navCollapsed,
  };
}

export function onNavStyleChange(sideNavTheme: any) {
  return {
    type: SIDE_NAV_STYLE_CHANGE,
    sideNavTheme,
  };
}

export function onLocaleChange(locale: any) {
  return {
    type: CHANGE_LOCALE,
    locale,
  };
}

export function onNavTypeChange(navType: any) {
  return {
    type: NAV_TYPE_CHANGE,
    navType,
  };
}

export function onTopNavColorChange(topNavColor: any) {
  return {
    type: TOP_NAV_COLOR_CHANGE,
    topNavColor,
  };
}

export function onHeaderNavColorChange(headerNavColor: any) {
  return {
    type: HEADER_NAV_COLOR_CHANGE,
    headerNavColor,
  };
}

export function onMobileNavToggle(mobileNav: any) {
  return {
    type: TOGGLE_MOBILE_NAV,
    mobileNav,
  };
}

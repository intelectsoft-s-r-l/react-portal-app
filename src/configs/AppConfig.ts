import {
  SIDE_NAV_LIGHT,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
  SIDE_NAV_DARK,
} from "../constants/ThemeConstant";
import { env } from "./EnvironmentConfig";

export const APP_NAME = "Client Portal App";
export const API_APP_URL = env!.API_APP_URL;
export const API_AUTH_URL = env!.API_AUTH_URL;
export const API_SMS_URL = env!.API_SMS_URL;
export const API_MAIL_URL = env!.API_MAIL_URL;
export const API_DISCOUNT_URL = env!.API_DISCOUNT_URL;
export const API_EDX_URL = env!.API_EDX_URL;
export const SUBDIR_PATH = env!.SUBDIR_PATH;
export const APP_PREFIX_PATH = "/app";
export const AUTH_PREFIX_PATH = "/auth";

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: "en",
  navType: NAV_TYPE_SIDE,
  topNavColor: "#fff",
  headerNavColor: "#193550",
  mobileNav: false,
};

import {
    SIDE_NAV_LIGHT,
    NAV_TYPE_SIDE,
    NAV_TYPE_TOP,
    SIDE_NAV_DARK,
} from "../constants/ThemeConstant";
import { env } from "./EnvironmentConfig";

export const APP_NAME = "Client Portal App";
export const APP_PREFIX_PATH = "/app";
export const AUTH_PREFIX_PATH = "/auth";
export const API_BASE_URL = env!.API_ENDPOINT_URL;

interface ThemeConfigProps {
    navCollapsed?: boolean;
    sideNavTheme?: string;
    locale?: string;
    navType?: string;
    topNavColor?: string;
    headerNavColor?: string;
    mobileNav?: boolean;
}

export const THEME_CONFIG = {
    navCollapsed: false,
    sideNavTheme: SIDE_NAV_LIGHT,
    locale: "en",
    navType: NAV_TYPE_SIDE,
    topNavColor: "#fff",
    headerNavColor: "#193550",
    mobileNav: false,
} as ThemeConfigProps;
